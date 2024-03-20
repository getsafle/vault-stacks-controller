const ObservableStore = require('obs-store')
const stacks = require('@stacks/wallet-sdk');
const transactions_1 = require('@stacks/transactions');
const helpers = require('./helper/index');

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
    }

    async addAccount() {
        let { networkType, wallet } = this.store.getState()
        wallet = stacks.generateNewAccount(wallet)
        const address = stacks.getStxAddress({ account: wallet.accounts[wallet.accounts.length - 1], transactionVersion: helpers.getTransactionVersion(networkType) });
        this.persistAllAddress(address)
        this.updatePersistentStore({ wallet: wallet })
        console.log("address = ", address);
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


module.exports = { KeyringController }