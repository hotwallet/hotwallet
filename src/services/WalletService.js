export default class WalletService {
  constructor({ state, accountService }) {
    this.state = state
    this.accountService = accountService
  }

  addWallet({ symbol, address = null, xpub = null, isManual = false, name = null }) {
    // const wallet = {
    //   symbol,
    //   address,
    //   xpub,
    //   isManual,
    //   name
    // }
    // todo: add wallet
  }

  getWallets({ symbol }) {
    // const accountId = this.accountService.getPrimaryAccount()
    return this.state.get('wallets')
  }

  setWalletName({ walletId, name }) {

  }

  setWalletSyncTime({ walletId }) {

  }

  removeWallet(walletId) {
    // delete transactions
    // delete wallet
  }
}
