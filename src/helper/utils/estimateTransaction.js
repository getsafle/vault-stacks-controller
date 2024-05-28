const { HIRO_API_KEY } = require("../../constants/index.js");
const common_1 = require("@stacks/common");
const { serializePayload } = require('@stacks/transactions/dist/payload');
const network_1 = require("@stacks/network");
const { NoEstimateAvailableError } = require("@stacks/transactions/dist/errors");

async function estimateTransaction(transactionPayload, estimatedLen, network) {

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-hiro-api-key": HIRO_API_KEY,
      },
      body: JSON.stringify({
        transaction_payload: (0, common_1.bytesToHex)(
          (0, serializePayload)(transactionPayload)
        ),
        ...(estimatedLen ? { estimated_len: estimatedLen } : {}),
      }),
    };
    const derivedNetwork = network_1.StacksNetwork.fromNameOrNetwork(network ?? new network_1.StacksMainnet());
    const url = derivedNetwork.getTransactionFeeEstimateApiUrl();
    const response = await derivedNetwork.fetchFn(url, options);
    if (!response.ok) {
        const body = await response.text().then(str => {
            try {
                return JSON.parse(str);
            }
            catch (error) {
                return str;
            }
        });
        if (body?.reason === 'NoEstimateAvailable' ||
            (typeof body === 'string' && body.includes('NoEstimateAvailable'))) {
            throw new NoEstimateAvailableError(body?.reason_data?.message ?? '');
        }
        throw new Error(`Error estimating transaction fee. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${body}"`);
    }
    const data = await response.json();
    return data.estimations;

}

async function estimateTransferUnsafe(transaction, network) {
    const requestHeaders = {
        Accept: 'application/text',
        "x-hiro-api-key": HIRO_API_KEY,
    };
    const fetchOptions = {
        method: 'GET',
        headers: requestHeaders,
    };
    const derivedNetwork = network_1.StacksNetwork.fromNameOrNetwork(network ?? deriveNetwork(transaction));
    const url = derivedNetwork.getTransferFeeEstimateApiUrl();
    const response = await derivedNetwork.fetchFn(url, fetchOptions);
    if (!response.ok) {
        let msg = '';
        try {
            msg = await response.text();
        }
        catch (error) { }
        throw new Error(`Error estimating transaction fee. Response ${response.status}: ${response.statusText}. Attempted to fetch ${url} and failed with the message: "${msg}"`);
    }
    const feeRateResult = await response.text();
    const txBytes = BigInt(transaction.serialize().byteLength);
    const feeRate = BigInt(feeRateResult);
    return feeRate * txBytes;
}

module.exports = { estimateTransaction, estimateTransferUnsafe }