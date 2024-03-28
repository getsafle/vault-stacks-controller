const { TransactionTypes } = require('@stacks/connect');
const { AnchorMode } = require('@stacks/transactions');
const { generatePostConditions } = require('./generatePostConditions')
const { gerenateFunctionArgs } = require('./gerenateFunctionArgs')

function isTransactionTypeSupported(txType) {
    return (
      txType === TransactionTypes.STXTransfer ||
      txType === TransactionTypes.ContractCall ||
      txType === TransactionTypes.ContractDeploy
    );
}

function generateUnsignedSTXTransferTx(transaction, privateKey, network) {
    const { from, to, amount, anchorMode } = transaction

    const rawTx = {
        recipient: to,
        amount: amount,
        anchorMode: anchorMode ?? AnchorMode.Any,
        senderKey: privateKey,
        network: network,
    };

    return rawTx
}

function generateUnsignedContractCallTx(transaction, privateKey, network) {
    const { from, to, amount, anchorMode, contractDetails : {contractAddress, contractName, assetName}, memo} = transaction

    const postConditions = generatePostConditions(transaction)
    const functionArgs = gerenateFunctionArgs(from, to, amount, memo)

    let rawTxContractCall = {
        recipient: to,
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: assetName,
        functionArgs: functionArgs,
        postConditions: postConditions,
        amount: amount,
        anchorMode: anchorMode ?? AnchorMode.Any,
        senderKey: privateKey,
        network: network,
    };

    return rawTxContractCall;
}

function generateUnsignedContractDeployTx(transaction, privateKey, network) {

}

function generateUnsignedTransaction(transaction, privateKey, network) {
    const { transactionType } = transaction

    const isValid = isTransactionTypeSupported(transactionType);

  if (!isValid) throw new Error(`Invalid Transaction Type: ${txData.txType}`);

    switch (transactionType) {
        case TransactionTypes.STXTransfer:
            return generateUnsignedSTXTransferTx(transaction, privateKey, network);
        case TransactionTypes.ContractCall:
            return generateUnsignedContractCallTx(transaction, privateKey, network);
        case TransactionTypes.ContractDeploy:
            return generateUnsignedContractDeployTx(transaction, privateKey, network);
    }

}

module.exports = { isTransactionTypeSupported, generateUnsignedSTXTransferTx, generateUnsignedContractCallTx, generateUnsignedContractDeployTx, generateUnsignedTransaction }