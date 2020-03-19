import { Address } from "@graphprotocol/graph-ts"
import { CreateName, ChangeWallet, ChangeOwner } from "../generated/NameService/NameService"

import { 
    Name, 
    Wallet
} from "../generated/schema"

import { loadWallet } from "./wallet"

export function handleCreateName(event: CreateName): void {
    setWallet(event.params.name, event.params.wallet.toString());
    setName(event.params.wallet, event.params.name);
    setOwner(event.params.name, event.params.owner);
}

export function handleChangeWallet(event: ChangeWallet): void {
    setWallet(event.params.name, event.params.wallet.toString());
}

export function handleChangeOwner(event: ChangeOwner): void {
    setOwner(event.params.name, event.params.newOwner);
}

function setWallet(id: string, wallet: string): void {
    let name = Name.load(id);

    if (name == null) {
        name = new Name(id);
    }

    name.wallet = wallet;
    name.save();
}

function setName(walletAddress: Address, name: string): void {
    loadWallet(walletAddress);
    let wallet = Wallet.load(walletAddress.toString());

    wallet.name = name;
    wallet.save();
}

function setOwner(id: string, newOwner: Address): void {
    let name = Name.load(id);

    if (name == null) {
        name = new Name(id);
    }

    name.owner = newOwner;
    name.save();
}
