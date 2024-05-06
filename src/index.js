const axios = require("axios");
const ObservableStore = require('obs-store')
const stacks = require('@stacks/wallet-sdk');
const transactions_1 = require('@stacks/transactions');
const { TransactionTypes } = require('@stacks/connect');
const helpers = require('./helper/index');
const { HIRO_BASE_URL, HIRO_BASE_TEST_URL }  = require('./constants/index');
const { NoEstimateAvailableError} = require('@stacks/transactions/dist/errors');

const { network: { MAINNET, TESTNET }} = require('./config/index')

class KeyringController {

    constructor(opts) {
        this.store = new ObservableStore({ mnemonic: opts.mnemonic, network: helpers.getActiveNetwork(opts.network), networkType: opts.network ? opts.network : MAINNET.NETWORK, wallet: null, address: [] })
        this.importedWallets = []  
    }

    async generateWallet() {
        const { mnemonic, networkType } = this.store.getState()
        let wallet = await stacks.generateWallet({ secretKey: mnemonic, password: ''});
        const address = stacks.getStxAddress({ account: wallet.accounts[wallet.accounts.length - 1], transactionVersion: helpers.getTransactionVersion(networkType) });
        this.persistAllAddress(address)
        this.updatePersistentStore({ wallet: wallet })
        return { address: address }
    }

    async addAccount() {
        let { networkType, wallet } = this.store.getState()
        wallet = stacks.generateNewAccount(wallet)
        const address = stacks.getStxAddress({ account: wallet.accounts[wallet.accounts.length - 1], transactionVersion: helpers.getTransactionVersion(networkType) });
        this.persistAllAddress(address)
        this.updatePersistentStore({ wallet: wallet })
        return { address: address }
    }

    async getAccounts() {
        const { address } = this.store.getState();
        return address
    }

    async exportPrivateKey(_address) {
        const { wallet, network, address } = this.store.getState()
        const idx = address.indexOf(_address)
        if (idx < 0)
          throw "Invalid address, the address is not available in the wallet"

        const pkey = wallet.accounts[idx].stxPrivateKey
        return { privateKey: pkey };
    }

    async importWallet(_privateKey) {
        let { networkType } = this.store.getState()
        const transactionVersion = helpers.getTransactionVersion(networkType)
        try {
          const address = transactions_1.getAddressFromPrivateKey(_privateKey, transactionVersion)
          this.importedWallets.push(address);
          return address
        } catch (e) {
          return Promise.reject(e)
        }
    }

    async signTransaction(transaction, _privateKey = null) {
        const { wallet, network, address } = this.store.getState()
        const { from, transactionType } = transaction

        let privateKey = _privateKey
        if (!privateKey) {
            const idx = address.indexOf(from)
            if (idx < 0)
                throw "Invalid address, the address is not available in the wallet"
            
            privateKey = wallet.accounts[idx].stxPrivateKey
        }

        const unsignedTransaction = await helpers.generateUnsignedTransaction(transaction, privateKey, network)
        let signedTransaction
        switch (transactionType) {
            case TransactionTypes.STXTransfer:
                signedTransaction = await transactions_1.makeSTXTokenTransfer(unsignedTransaction);
                break;
            case TransactionTypes.ContractCall:
                signedTransaction = await transactions_1.makeContractCall(unsignedTransaction);
                break;
        }
        
        return { signedTransaction };
        
    }

    async signMessage(message, _address, _privateKey = null) {
        const { wallet, address } = this.store.getState()
        const messageHash = Buffer.from(message).toString('hex');

        let privateKey = _privateKey
        if (!privateKey) {
            const idx = address.indexOf(_address)
            if (idx < 0)
                throw "Invalid address, the address is not available in the wallet"
            
            privateKey = wallet.accounts[idx].stxPrivateKey
        }
        const privKey = (0, transactions_1.createStacksPrivateKey)(privateKey);

        const signature = transactions_1.signMessageHashRsv({messageHash: messageHash, privateKey: privKey});
        return { signedMessage: signature.data };
    }

    async sendTransaction(TransactionObj) {
        const { network } = this.store.getState()
        const broadcastResponse = await transactions_1.broadcastTransaction(TransactionObj, network);
        return { transactionDetails: broadcastResponse.txid }
    }


    async getFees(rawTransaction, _privateKey) {

        const { wallet, network, address } = this.store.getState()
        const { from } = rawTransaction

        let privateKey = _privateKey
        if (!privateKey) {
            const idx = address.indexOf(from)
            if (idx < 0)
                throw "Invalid address, the address is not available in the wallet"
            
            privateKey = wallet.accounts[idx].stxPrivateKey
        }

        const payload = helpers.generatePayload(rawTransaction);
        let txOptions = await helpers.generateUnsignedTransaction(rawTransaction, privateKey, network)
        const transaction = helpers.generateStacksTransactionObject(txOptions, rawTransaction.transactionType, payload)
        
        let fees
        try{
            const estimatedLen = transactions_1.estimateTransactionByteLength(transaction, network);
            let fee = (await transactions_1.estimateTransaction(transaction.payload, estimatedLen, network));
            fees = {
                slow: fee[0].fee,
                standard: fee[1].fee,
                fast: fee[2].fee
            }
            return { fees: fees };

        }catch (error) {
            if (error instanceof NoEstimateAvailableError) {
                let fee = await transactions_1.estimateTransferUnsafe(transaction, network);
                fees = {
                    slow: fee,
                    standard: fee,
                    fast: fee,
                }
                return { fees: fees };
                
            }
            throw error; 
        } 
    }

    persistAllAddress(_address) {
        const { address } = this.store.getState()
        const newAdd = address
        newAdd.push(_address)
        this.store.updateState({ address: newAdd })
        return true
    }
    
    updatePersistentStore(obj) {
        this.store.updateState(obj)
        return true
    }
}

const getBalance = async (address, network) => {
    try {
        let URL = network === TESTNET ? HIRO_BASE_TEST_URL : HIRO_BASE_URL
        URL = URL + `address/${address}/balances`
        const balance = await axios({
          url : `${URL}`,
          method: 'GET'
        });
        return { balance: balance.data.stx.balance / 1000000 }
      } catch (err) {
        throw err
      }
}


module.exports = { KeyringController, getBalance }