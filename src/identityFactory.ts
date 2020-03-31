import { DeployIdentity } from "../generated/IdentityFactory/IdentityFactory"
import { Identity as IdentityContract } from "../generated/templates"
import { Wallet as WalletContract } from "../generated/templates"

import { 
    Identity,
    Wallet
} from "../generated/schema"

import { loadWallet } from "./wallet"

export function handleDeployIdentity(event: DeployIdentity): void {
    IdentityContract.create(event.params.identity);
    WalletContract.create(event.params.wallet);

    let identityAddress = event.params.identity.toHexString();
    let identity = new Identity(identityAddress);
    loadWallet(event.params.wallet);
    let wallet = Wallet.load(event.params.wallet.toString());

    //initialize identity vars
    identity.dataHash = event.params.dataHash;
    identity.owner = event.params.owner;
    identity.recovery = event.params.recovery;
    identity.state = 10;
    identity.wallet = wallet.id;
    wallet.name = event.params.name;
    wallet.identity = identity.id;
    identity.lastModification = event.block.timestamp;
    identity.creationTime = event.block.timestamp;

    identity.save();
    wallet.save(); 
}