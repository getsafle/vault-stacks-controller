const axios = require("axios");
const { network: { MAINNET, TESTNET }} = require('../../config/index')
const { HIRO_BASE_URL, HIRO_BASE_TEST_URL, HIRO_API_KEY } = require('../../constants/index')

async function generateNextNonce(address, network) {
    try {
        let URL = network === TESTNET ? HIRO_BASE_TEST_URL : HIRO_BASE_URL
        URL = URL + `address/${address}/nonces`
        const nonce = await axios({
          url : `${URL}`,
          method: 'GET',
          headers: {
            "x-hiro-api-key": HIRO_API_KEY,
          },
        });
        return { nonce: BigInt(nonce.data.possible_next_nonce) }
      } catch (err) {
        throw err
      }
}

module.exports = { generateNextNonce }