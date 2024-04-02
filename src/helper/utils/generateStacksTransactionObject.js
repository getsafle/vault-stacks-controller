const { TransactionTypes } = require('@stacks/connect');
const transactions_1 = require('@stacks/transactions');

function generateStacksTransactionObject(txOptions, transactionType, payload) {

    if (transactionType === TransactionTypes.STXTransfer) {
        let defaultOptions = {
            fee: BigInt(0),
            nonce: BigInt(0),
            network: txOptions.network,
            memo : '',
            sponsored: false,
        };
        txOptions = Object.assign(defaultOptions, txOptions);
        
        const publicKey = (0, transactions_1.publicKeyToString)((0, transactions_1.getPublicKey)((0, transactions_1.createStacksPrivateKey)(txOptions.senderKey)));
        let spendingCondition = (0, transactions_1.createSingleSigSpendingCondition)(transactions_1.AddressHashMode.SerializeP2PKH, publicKey, txOptions.nonce, txOptions.fee);
        let authorization = (0, transactions_1.createStandardAuth)(spendingCondition);
        const transaction = new transactions_1.StacksTransaction(txOptions.network.version, authorization, payload, undefined, undefined, txOptions.anchorMode, txOptions.network.chainId);
        return transaction;
    }
    else if (transactionType === TransactionTypes.ContractCall) {
        const defaultOptions = {
            fee: BigInt(0),
            nonce: BigInt(0),
            network: txOptions.network,
            postConditionMode: transactions_1.PostConditionMode.Deny,
            sponsored: false,
        };
        txOptions = Object.assign(defaultOptions, txOptions);
        
        const publicKey = (0, transactions_1.publicKeyToString)((0, transactions_1.getPublicKey)((0, transactions_1.createStacksPrivateKey)(txOptions.senderKey)));
        let spendingCondition = (0, transactions_1.createSingleSigSpendingCondition)(transactions_1.AddressHashMode.SerializeP2PKH, publicKey, txOptions.nonce, txOptions.fee);
        let authorization = (0, transactions_1.createStandardAuth)(spendingCondition);
        const lpPostConditions = (0, transactions_1.createLPList)(txOptions.postConditions);
        const transaction = new transactions_1.StacksTransaction(txOptions.network.version, authorization, payload, lpPostConditions, txOptions.postConditionMode, txOptions.anchorMode, txOptions.network.chainId);
        return transaction;
    }
}

module.exports = { generateStacksTransactionObject }
