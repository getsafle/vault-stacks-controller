const {StacksTestnet, StacksMainnet} = require('@stacks/network');
const { TransactionVersion } = require('@stacks/transactions');
const { network: { MAINNET, TESTNET }} = require('../config/index')

function getActiveNetwork(_network){
    return _network === TESTNET ? new StacksTestnet() : new StacksMainnet()
}

function getTransactionVersion(_network){
    return _network === TESTNET ? TransactionVersion.Testnet : TransactionVersion.Mainnet
}

module.exports = { getActiveNetwork , getTransactionVersion }