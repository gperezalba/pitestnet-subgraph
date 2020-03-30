import { Address, BigDecimal, Bytes, BigInt } from "@graphprotocol/graph-ts"
import { Transfer } from "../generated/templates/Token/Token"
import { NewToken, NewHolders } from "../generated/AddToken/AddToken"

import { 
    Transaction,
    Token,
    TokenBalance, 
    Wallet
} from "../generated/schema"

import { Token as TokenContract } from "../generated/templates/Token/Token"

import { getBalance } from "./helpers"
import { pushWalletTransaction } from "./wallet"

/***************************************************************/
// TOKEN
/***************************************************************/

export function handleNewToken(event: NewToken): void {
    addToken(event.params.tokenAddress)
}

export function handleNewHolders(event: NewHolders): void {
    addToken(event.params.tokenAddress);

    let holders = event.params.holders;

    for (let i = 0; i < event.params.holders.length; i++) {
        addTokenHolder(event.params.tokenAddress.toString(), holders[i].toString());
        updateTokenBalance(event.params.tokenAddress, holders[i].toString());
    }
}

export function handleTokenTransaction(event: Transfer): void {
    addToken(event.address);
    addTokenHolder(event.address.toString(), event.params.to.toString());
    updateTokenBalance(event.address, event.params.to.toString());
    updateTokenBalance(event.address, event.params.from.toString());
    newTransaction(event);
}

function addToken(tokenAddress: Address): void {
    let token = Token.load(tokenAddress.toString());

    if (token == null) {
        token = new Token(tokenAddress.toString());
        let contract = TokenContract.bind(tokenAddress);
    
        token.tokenSymbol = contract.symbol();
        token.tokenName = contract.name();
        token.tokenDecimals = contract.decimals();
        token.totalSupply = contract.totalSupply().toBigDecimal();
    
        token.save();
    } 
}

function addTokenHolder(tokenAddress: string, holder: string): void {
    let token = Token.load(tokenAddress);

    if (token !== null) { //Si el token no existe no hago nada

        let currentHolders = token.holders;

        //Si el holder no está en el array ya, lo incluyo
        if (!currentHolders.includes(holder)) {
            currentHolders.push(holder);
            token.holders = currentHolders;
            token.save();
        }
    }
}

export function handleTokenMint(id: string, amount: BigDecimal): void {
    let token = Token.load(id);

    if (token !== null) {
        token.totalSupply = token.totalSupply.plus(amount);
        token.save();
    }
}
  
export function handleTokenBurn(id: string, amount: BigDecimal): void {
    //comprobar que el from sea el owner del moento sino no es un burn
    let token = Token.load(id);

    if (token !== null) {
        token.totalSupply = token.totalSupply.minus(amount);
        token.save();
    }
}

/***************************************************************/
// TRANSACTION
/***************************************************************/

export function newTransaction(event: Transfer): void {
    let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    let tx = Transaction.load(txId);

    if (tx == null) {
        let txId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
        tx = createTransaction(
            txId, 
            event.params.from, 
            event.params.to, 
            event.address.toString(), 
            event.params.value.toBigDecimal(), 
            event.params.data, 
            event.block.timestamp, 
            event.transaction.gasUsed.toBigDecimal().times(event.transaction.gasPrice.toBigDecimal()),
            false
        );
    }

    if (event.params.from == Address.fromI32(0)) {
        handleTokenMint(event.address.toString(), event.params.value.toBigDecimal());
    }

    if (event.params.to == Address.fromI32(0)) {
        handleTokenBurn(event.address.toString(), event.params.value.toBigDecimal());
    }

    pushWalletTransaction(tx as Transaction, event.params.to.toString());
    pushWalletTransaction(tx as Transaction, event.params.from.toString());
}

export function createTransaction(
    txId: string,
    from: Address,
    to: Address,
    currency: string,
    amount: BigDecimal,
    data: Bytes,
    timestamp: BigInt,
    fee: BigDecimal,
    isBankTransaction: boolean
): 
    Transaction 
{
    let tx = new Transaction(txId);

    tx.from = from;
    tx.to = to;
    tx.currency = currency;
    tx.amount = amount;
    tx.data = data;
    tx.timestamp = timestamp;
    tx.fee = fee;
    tx.isBankTransaction = isBankTransaction;

    tx.save();

    return tx as Transaction;
}

/***************************************************************/
// TOKEN BALANCE
/***************************************************************/

export function updateTokenBalance(tokenAddress: Address, walletAddress: string): void {
    let token = Token.load(tokenAddress.toString());

    if (token !== null) { //Si el token no existe no hago nada

        let tokenBalance = TokenBalance.load(tokenAddress.toString());

        if (tokenBalance == null) { //no existe aún, al crearlo se actualiza/inicializa
            loadTokenBalance(tokenAddress, walletAddress);
        } else { //actualizar si ya existía
            if (tokenAddress == Address.fromI32(0)) {
                tokenBalance.balance = getBalance(Address.fromString(walletAddress));
            } else {
                let token = TokenContract.bind(tokenAddress);
                tokenBalance.balance = token.balanceOf(Address.fromString(walletAddress)).toBigDecimal();
            }
    
            tokenBalance.save();
        }
    }
}

function loadTokenBalance(tokenAddress: Address, walletAddress: string): void {
    let token = Token.load(tokenAddress.toString());

    if (token !== null) { //Si el token no existe no hago nada
        let id = tokenAddress.toString().concat('-').concat(walletAddress);
        let tokenBalance = TokenBalance.load(id);
        
        if (tokenBalance == null) { //Si no existe el tokenBalance lo creo
            tokenBalance = new TokenBalance(id);
            tokenBalance.token = token.id;

            let wallet = Wallet.load(walletAddress);

            if (wallet == null) { //Si no existe el wallet lo creo
                wallet = new Wallet(walletAddress);
                //Añado al wallet este tokenBalance ya que como lo acabo de crear no lo tendrá
                wallet.balances.push(tokenBalance.id);
            }

            //si el wallet existía pero no tenia el tokenBalance, lo incluyo
            if (!wallet.balances.includes(id)) { 
                wallet.balances.push(tokenBalance.id);
            }

            wallet.save();
            tokenBalance.save();

            updateTokenBalance(tokenAddress, walletAddress);
        }
    }
}



  

  




