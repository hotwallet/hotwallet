export default class WalletService {
  constructor({ db, accountService }) {
    this.db = db
    this.accountService = accountService
  }

  async addWallet({ symbol, address = null, xpub = null, isManual = false, name = null }) {
    const asset = await this.db.assets.get(symbol)
    if (!asset) throw new Error('Invalid symbol')
    const wallets = await this.getWallets({ symbol })
    // TODO: validate unique address and xpub
    return this.db.wallets.post({
      symbol,
      address,
      xpub,
      isManual,
      name
    })
  }

  async getWallets({ symbol }) {
    const accountId = await this.accountService.getPrimaryAccount()
    return this.db.wallets.find({
      selector: { accountId, symbol }
    })
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
