const {createTokenTransferPayload, createContractCallPayload} = require('@stacks/transactions/dist/payload');
const { isTransactionTypeSupported } = require('./generateUnsignedTransaction')
const { TransactionTypes } = require('@stacks/connect');
const { generateFunctionArgs } = require('./generateFunctionArgs')

function generatePayload(transaction) {

    const { transactionType } = transaction

    const isValid = isTransactionTypeSupported(transactionType);

    if (!isValid) throw new Error(`Invalid Transaction Type: ${transactionType}`);

    switch (transactionType) {
        case TransactionTypes.STXTransfer:
            return createTokenTransferPayload(transaction.to, transaction.amount, transaction?.memo);
        case TransactionTypes.ContractCall:
            const functionArgs = generateFunctionArgs(transaction.from, transaction.to, transaction.amount, transaction?.memo)
            return createContractCallPayload(transaction.contractDetails.contractAddress, transaction.contractDetails.contractName, 'transfer', functionArgs);
    }

}

module.exports = { generatePayload }