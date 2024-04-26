const BN = require('bn.js');
const {
    FungibleConditionCode,
    createAssetInfo,
    makeStandardFungiblePostCondition,
  } = require('@stacks/transactions');

function generatePostConditions(transaction) {
    const { from, to, amount, contractDetails : {contractAddress, contractName, assetName}} = transaction

    const assetInfo = createAssetInfo(contractAddress, contractName, assetName);

    const pc = makeStandardFungiblePostCondition(
        from,
        FungibleConditionCode.Equal,
        new BN(amount, 10).toString(),
        assetInfo
    );

    return [pc]
}
  
module.exports = { generatePostConditions }
