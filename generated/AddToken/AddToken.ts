// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  EthereumCall,
  EthereumEvent,
  SmartContract,
  EthereumValue,
  JSONValue,
  TypedMap,
  Entity,
  EthereumTuple,
  Bytes,
  Address,
  BigInt,
  CallResult
} from "@graphprotocol/graph-ts";

export class NewToken extends EthereumEvent {
  get params(): NewToken__Params {
    return new NewToken__Params(this);
  }
}

export class NewToken__Params {
  _event: NewToken;

  constructor(event: NewToken) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get symbol(): string {
    return this._event.parameters[1].value.toString();
  }

  get name(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class NewHolders extends EthereumEvent {
  get params(): NewHolders__Params {
    return new NewHolders__Params(this);
  }
}

export class NewHolders__Params {
  _event: NewHolders;

  constructor(event: NewHolders) {
    this._event = event;
  }

  get tokenAddress(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get holders(): Array<Address> {
    return this._event.parameters[1].value.toAddressArray();
  }
}

export class AddToken extends SmartContract {
  static bind(address: Address): AddToken {
    return new AddToken("AddToken", address);
  }

  owner(): Address {
    let result = super.call("owner", []);

    return result[0].toAddress();
  }

  try_owner(): CallResult<Address> {
    let result = super.tryCall("owner", []);
    if (result.reverted) {
      return new CallResult();
    }
    let value = result.value;
    return CallResult.fromValue(value[0].toAddress());
  }
}

export class AddHoldersCall extends EthereumCall {
  get inputs(): AddHoldersCall__Inputs {
    return new AddHoldersCall__Inputs(this);
  }

  get outputs(): AddHoldersCall__Outputs {
    return new AddHoldersCall__Outputs(this);
  }
}

export class AddHoldersCall__Inputs {
  _call: AddHoldersCall;

  constructor(call: AddHoldersCall) {
    this._call = call;
  }

  get _tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _holders(): Array<Address> {
    return this._call.inputValues[1].value.toAddressArray();
  }
}

export class AddHoldersCall__Outputs {
  _call: AddHoldersCall;

  constructor(call: AddHoldersCall) {
    this._call = call;
  }
}

export class AddTokenCall extends EthereumCall {
  get inputs(): AddTokenCall__Inputs {
    return new AddTokenCall__Inputs(this);
  }

  get outputs(): AddTokenCall__Outputs {
    return new AddTokenCall__Outputs(this);
  }
}

export class AddTokenCall__Inputs {
  _call: AddTokenCall;

  constructor(call: AddTokenCall) {
    this._call = call;
  }

  get _tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _symbol(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _name(): string {
    return this._call.inputValues[2].value.toString();
  }
}

export class AddTokenCall__Outputs {
  _call: AddTokenCall;

  constructor(call: AddTokenCall) {
    this._call = call;
  }
}

export class ConstructorCall extends EthereumCall {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}