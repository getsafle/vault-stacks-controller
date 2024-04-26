# vault-stacks-controller<code><a href="https://www.docker.com/" target="_blank"><img height="50" src="https://assets-global.website-files.com/618b0aafa4afde65f2fe38fe/65d8f85573da2c351da7fe13_logo%20(1).png"></a></code>

[![npm version](https://badge.fury.io/js/@getsafle%2Fvault-stacks-controller.svg)](https://badge.fury.io/js/@getsafle%2Fvault-stacks-controller) <img alt="Static Badge" src="https://img.shields.io/badge/License-MIT-green">   [![Discussions][discussions-badge]][discussions-link]
 <img alt="Static Badge" src="https://img.shields.io/badge/stacks_controller-documentation-purple"> 



## Install

`npm install --save @getsafle/vault-stacks-controller`

## Initialize the Stacks Controller class

```
const { KeyringController, getBalance } = require('@getsafle/vault-stacks-controller');

const stacksController = new KeyringController({
    // 12 words mnemonic to create wallet
    mnemonic: string,
    // network - type of network [TESTNET|MAINNET]
    // default is MAINNET even if no network is passed
    network: string (TESTNET | MAINNET)
});
```

## Methods

### Generate Keyring with 1 account or add new account

```
const keyringState = await stacksController.addAccount();
```

### Export the private key of an address present in the keyring

```
const privateKey = await stacksController.exportPrivateKey(address);
```

### Get all accounts in the keyring

```
const privateKey = await stacksController.getAccounts();
```

### Sign a transaction

```
const signedTx = await stacksController.signTransaction(stacksTx);

stacksTx: {from, to, amount, transactionType}

transactionType = 'token_transfer' || 'contract_call
```

### Sign a message

```
const signedMsg = await stacksController.signMessage(msgString, address);
```

### Get fees

```
const fees = await stacksController.getFees(rawTransaction);
```

### Get balance

```
const balance = await getBalance(address, network); // if network !== TESTNET then it will fetch mainnet balance
```

[discussions-badge]: https://img.shields.io/badge/Code_Quality-passing-rgba
[discussions-link]: https://github.com/getsafle/vault-stacks-controller/actions
