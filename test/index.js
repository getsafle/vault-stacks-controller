
var assert = require('assert');
const {KeyringController : StacksKerring, getBalance } = require('../src/index')
const {
    HD_WALLET_12_MNEMONIC,
    TEST_ADDRESS_1,
    PRIVATE_KEY_1,
    TEST_ADDRESS_2,
    EXTERNAL_ACCOUNT_PRIVATE_KEY,
    EXTERNAL_ACCOUNT_ADDRESS,
    VELAR_CONTRACT_ADDRESS,
    CONTRACT_NAME,
    ASSET_NAME,
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
    
    it('addAccount', async () => {
        const wallet = await stacksKeyring.addAccount();
        assert(wallet.address === TEST_ADDRESS_2, "Added address should be " + TEST_ADDRESS_2)
    })

    it('get accounts', async () => {
        const accounts = await stacksKeyring.getAccounts();
        console.log("accounts =", accounts);
        assert(accounts[0] === TEST_ADDRESS_1, "First account should be " + TEST_ADDRESS_1)
        assert(accounts[1] === TEST_ADDRESS_2, "First account should be " + TEST_ADDRESS_2)
    })
    
    it('importWallet', async () => {
        const importedAddress = await stacksKeyring.importWallet(EXTERNAL_ACCOUNT_PRIVATE_KEY)
        assert(importedAddress === EXTERNAL_ACCOUNT_ADDRESS, "Imported address should be " + EXTERNAL_ACCOUNT_ADDRESS)
    })

    it('exportPrivateKey', async () => {
        const {privateKey} = await stacksKeyring.exportPrivateKey(TEST_ADDRESS_1)
        assert(privateKey === PRIVATE_KEY_1, "Exported private key should be " + PRIVATE_KEY_1)
    })

    it('getBalance', async () => {
        const { balance } = await getBalance(TEST_ADDRESS_1, "TESTNET")
        assert(balance > 0, "Balance should be greater than 0")
    })

    
    it("sign STX transfer transaction", async () => {
        const acc = await stacksKeyring.getAccounts();
        const txns = {
          from: acc[0],
          to: acc[1],
          amount: 1,
          transactionType: "token_transfer",
        };
    
        let { signedTransaction } = await stacksKeyring.signTransaction(txns);
    
        assert(signedTransaction.payload, "Transaction not signed successfully");
        assert(signedTransaction.auth, "Transaction not signed successfully");
    });
    
    it("invalid transaction type", async () => {
        const acc = await stacksKeyring.getAccounts();
        const txns = {
            from: acc[0],
            to: acc[1],
            amount: 1,
            transactionType: "abc",
        };

        try {
            let { signedTransaction } = await stacksKeyring.signTransaction(txns);
        } catch (e) {
            assert(e.message === "Invalid Transaction Type: abc");
        }
    });

    it("sign contract function call, NFT transfer transaction", async () => {
        const acc = await stacksKeyring.getAccounts();

        const txnsVelar = {
            from: acc[0],
            to: acc[1],
            amount: 1,
            contractDetails: {
            contractAddress: VELAR_CONTRACT_ADDRESS,
            contractName: CONTRACT_NAME,
            assetName: ASSET_NAME,
            },
            transactionType: "contract_call",
        };

        let { signedTransaction } = await stacksKeyring.signTransaction(txnsVelar);

        assert(signedTransaction.payload, "Transaction not signed successfully")
        assert(signedTransaction.auth, "Transaction not signed successfully")
    });


    it("invalid contract function call, NFT transfer transaction", async () => {
        const acc = await stacksKeyring.getAccounts();

        // not sending contract information
        const txnsVelar = {
            from: acc[0],
            to: acc[1],
            amount: 1,
        //   contractDetails: {
        //     contractAddress: VELAR_CONTRACT_ADDRESS,
        //     contractName: CONTRACT_NAME,
        //     assetName: ASSET_NAME,
        //   },
            transactionType: "contract_call",
        };

        try{
            let { signedTransaction } = await stacksKeyring.signTransaction(txnsVelar);
        }catch (e){
            assert(e.message === "Contract Details are missing");
        }
    });


    it('sign Message', async () => {
        const acc = await stacksKeyring.getAccounts();
        let msg1  = await stacksKeyring.signMessage(TESTING_MESSAGE_1, acc[0], PRIVATE_KEY_1)
        assert(msg1.signedMessage, "Message not signed successfully")
    })


    it('invalid pKey to sign Message', async () => {
        const acc = await stacksKeyring.getAccounts();
        try {
            let msg1  = await stacksKeyring.signMessage(TESTING_MESSAGE_1, acc[1], 'abc')
        }catch (e) {
            assert(e.message === "Improperly formatted private-key. Private-key byte length should be 32 or 33. Length provided: 2");
        }
        
    })
    
    
});