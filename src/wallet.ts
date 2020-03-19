import { Address } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Wallet/Wallet"

import { 
    Wallet,
    Token,
    Transaction,
    BankTransaction,
    BankFee
} from "../generated/schema"

import { createTransaction } from "./token"

export function handleTransfer(event: Transfer): void {
    let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let tx = Transaction.load(txId);

    if (tx == null) {
        let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
        createTransaction(
            txId, 
            event.address, 
            event.params.to, 
            event.address.toString(), 
            event.params.value.toBigDecimal(), 
            event.params.data, 
            event.block.timestamp, 
            event.transaction.gasUsed.toBigDecimal().times(event.transaction.gasPrice.toBigDecimal()),
            true
        );
    }

    let bankTxId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let bankTransaction = BankTransaction.load(bankTxId);

    if (bankTransaction == null) {
        bankTransaction = new BankTransaction(bankTxId);
    }

    bankTransaction.transaction = tx.toString();
    bankTransaction.kind = event.params.kind;
    bankTransaction.concept = event.params.data.toString();
    
    let bankFee = BankFee.load(bankTxId);

    if (bankFee == null) {
        bankFee = new BankFee(bankTxId);
    }

    bankFee.transaction = bankTransaction.toString();
    bankFee.kind = event.params.kind;
    bankFee.fee = event.params.commission.toBigDecimal();

    bankFee.save();

    bankTransaction.bankFee = bankFee.toString();

    bankTransaction.save();

    pushWalletBankTransaction(tx, tx.to.toString());
    pushWalletBankTransaction(tx, tx.from.toString());
}

export function pushWalletTransaction(tx: Transaction, walletAddress: string): void {
    let token = Token.bind(tx.currency);

    if (token !== null) {

        let wallet = loadWallet(Address.fromString(walletAddress));
    
        if (!wallet.transactions.includes(tx.id)) {
            wallet.transactions.push(tx.id);
        }
    
        wallet.save();
    }
}

export function pushWalletBankTransaction(tx: Transaction, walletAddress: string): void {
    let token = Token.bind(tx.currency);

    if (token !== null) {

        let wallet = loadWallet(Address.fromString(walletAddress));
    
        if (!wallet.bankTransactions.includes(tx.toString())) {
            wallet.bankTransactions.push(tx.toString());
        }
    
        wallet.save();
    }
}

export function loadWallet(address: Address): Wallet {
    let wallet = Wallet.load(address.toString());
    
    if (wallet == null) {
        wallet = new Wallet(address.toString());
    }

    wallet.save();

    return wallet as Wallet;
}