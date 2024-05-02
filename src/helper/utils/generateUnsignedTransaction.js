const { TransactionTypes } = require('@stacks/connect');
const { AnchorMode } = require('@stacks/transactions');
const { generatePostConditions } = require('./generatePostConditions')
const { generateFunctionArgs } = require('./generateFunctionArgs')
const { generateNextNonce } = require('./generateNextNonce')

function isTransactionTypeSupported(txType) {
    return (
      txType === TransactionTypes.STXTransfer ||
      txType === TransactionTypes.ContractCall ||
      txType === TransactionTypes.ContractDeploy
    );
}

function generateUnsignedSTXTransferTx(transaction, privateKey, network, nonce) {
    const { from, to, amount, anchorMode, memo } = transaction

    const rawTx = {
        recipient: to,
        amount: amount,
        anchorMode: anchorMode ?? AnchorMode.Any,
        senderKey: privateKey,
        network: network,
        memo: memo ? memo : ''
    };

    if(nonce) rawTx.nonce = nonce

    return rawTx
}

function generateUnsignedContractCallTx(transaction, privateKey, network, nonce) {
    if (!transaction?.contractDetails?.assetName || !transaction?.contractDetails?.contractName || !transaction?.contractDetails?.contractAddress) {
        throw new Error("Contract Details are missing")
    }
    const { from, to, amount, anchorMode, contractDetails : {contractAddress, contractName, assetName}, memo} = transaction

    const postConditions = generatePostConditions(transaction)
    const functionArgs = generateFunctionArgs(from, to, amount, memo)

    let rawTxContractCall = {
        recipient: to,
        contractAddress: contractAddress,
        contractName: contractName,
        functionName: 'transfer',
        functionArgs: functionArgs,
        postConditions: postConditions,
        amount: amount,
        anchorMode: anchorMode ?? AnchorMode.Any,
        senderKey: privateKey,
        network: network,
    };

    if(nonce) rawTxContractCall.nonce = nonce

    return rawTxContractCall;
}

async function generateUnsignedTransaction(transaction, privateKey, network) {
    const { transactionType } = transaction

    const isValid = isTransactionTypeSupported(transactionType);

    const { nonce } = await generateNextNonce(transaction.from, network)

    if (!isValid) throw new Error(`Invalid Transaction Type: ${transactionType}`);

        switch (transactionType) {
            case TransactionTypes.STXTransfer:
                return generateUnsignedSTXTransferTx(transaction, privateKey, network, nonce);
            case TransactionTypes.ContractCall:
                return generateUnsignedContractCallTx(transaction, privateKey, network, nonce);
        }

}

module.exports = { isTransactionTypeSupported, generateUnsignedSTXTransferTx, generateUnsignedContractCallTx, generateUnsignedTransaction }