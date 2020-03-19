import { DeployIdentity } from "../generated/IdentityFactory/IdentityFactory"
import { Identity as IdentityContract } from "../generated/templates"
import { Wallet as WalletContract } from "../generated/templates"

import { 
    Identity
} from "../generated/schema"

import { loadWallet } from "./wallet"

export function handleDeployIdentity(event: DeployIdentity): void {
    const identityAddress = event.params.identity.toHexString();
    let identity = new Identity(identityAddress);
    let wallet = loadWallet(event.params.wallet);

    //initialize identity vars
    identity.dataHash = event.params.dataHash;
    identity.owner = event.params.owner;
    identity.recovery = event.params.recovery;
    identity.state = 10;
    identity.wallet = wallet.toString();
    wallet.name = event.params.name;
    wallet.identity = identity.toString();
    identity.lastModification = event.block.timestamp;
    identity.creationTime = event.block.timestamp;

    identity.save();
    wallet.save();

    IdentityContract.create(event.params.identity);
    WalletContract.create(event.params.wallet);
}