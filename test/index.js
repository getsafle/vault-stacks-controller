
var assert = require('assert');
const {KeyringController : StacksKerring } = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC,
    TEST_ADDRESS_1,
    PRIVATE_KEY_1,
    TEST_ADDRESS_2,
    EXTERNAL_ACCOUNT_PRIVATE_KEY,
    EXTERNAL_ACCOUNT_ADDRESS,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_1,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_2,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_3,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_4,
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3,
    STACKS_NETWORK: {
        TESTNET,
        MAINNET
    },
} = require('./constants')

const opts = {mnemonic: HD_WALLET_12_MNEMONIC, network: 'TESTNET'}

describe('KeyringController', async () => {

    let stacksKeyring
    before(async () => {
        stacksKeyring = new StacksKerring(opts);
        await stacksKeyring.generateWallet();
    })

    it('get accounts', async () => {
        const accounts = await stacksKeyring.getAccounts();
        console.log("accounts =", accounts);
        assert(accounts[0] === TEST_ADDRESS_1, "First account should be " + TEST_ADDRESS_1)
        
    })
    
    it('addAccount', async () => {
        const wallet = await stacksKeyring.addAccount();
        assert(wallet.address === TEST_ADDRESS_2, "Added address should be " + TEST_ADDRESS_2)
    })

    it('importWallet', async () => {
        const importedAddress = await stacksKeyring.importWallet(EXTERNAL_ACCOUNT_PRIVATE_KEY)
        assert(importedAddress === EXTERNAL_ACCOUNT_ADDRESS, "Imported address should be " + EXTERNAL_ACCOUNT_ADDRESS)
    })

    it('exportPrivateKey', async () => {
        const {privateKey} = await stacksKeyring.exportPrivateKey(TEST_ADDRESS_1)
        assert(privateKey === PRIVATE_KEY_1, "Exported private key should be " + PRIVATE_KEY_1)
    })

    
})