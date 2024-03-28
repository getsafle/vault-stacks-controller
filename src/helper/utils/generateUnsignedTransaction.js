const { TransactionTypes } = require('@stacks/connect');

function isTransactionTypeSupported(txType) {
    return (
      txType === TransactionTypes.STXTransfer ||
      txType === TransactionTypes.ContractCall ||
      txType === TransactionTypes.ContractDeploy
    );
}

function generateUnsignedSTXTransferTx(transaction, privateKey, network) {
    const { from, to, amount } = transaction

    const rawTx = {
        recipient: to,
        amount: amount,
        anchorMode: 'any',
        senderKey: privateKey,
        network: network,
    };

    return rawTx
}

function generateUnsignedContractCallTx(transaction, privateKey, network) {

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