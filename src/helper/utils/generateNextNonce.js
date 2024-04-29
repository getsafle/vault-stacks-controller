const axios = require("axios");
const { network: { MAINNET, TESTNET }} = require('../../config/index')
const { QUICKNODE_BASE_URL, QUICKNODE_BASE_TEST_URL } = require('../../constants/index')

async function generateNextNonce(address, network) {
    try {
        let URL = network === TESTNET ? QUICKNODE_BASE_TEST_URL : QUICKNODE_BASE_URL
        URL = URL + `address/${address}/nonces`
        const nonce = await axios({
          url : `${URL}`,
          method: 'GET'
        });
        return { nonce: BigInt(nonce.data.possible_next_nonce) }
      } catch (err) {
        throw err
      }
}

module.exports = { generateNextNonce }