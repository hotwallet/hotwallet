import hwClient from '../lib/hotwalletClient'
import Promise from 'bluebird'

export default class AssetService {
  constructor({ db, accountService, transactionService, walletService }) {
    this.db = db
    this.accountService = accountService
    this.txService = transactionService
    this.walletService = walletService
  }

  getAsset(symbol) {
    return this.db.assets.get(symbol)
  }

  getPriceHistory(symbol) {
    return this.db.prices.find({
      selector: { symbol, date: { $exists: true } },
      sort: ['date']
    })
  }

  // hmm..
  // - only import missing assets added after certain date?
  // - don't erase the balance when importing?
  async importAssets() {
    const primaryAccount = await this.accountService.getPrimaryAccount()
    const { baseCurrency } = primaryAccount
    const assets = (await hwClient.get('/securities', {
      baseCurrency,
      limit: 2000
    })).map(asset => ({
      _id: asset.symbol,
      ...asset
    }))
    return this.db.assets.bulkDocs(assets)
  }

  async getAssets() {
    const primaryAccount = await this.accountService.getPrimaryAccount()
    const { showBlankBalances } = primaryAccount
    return this.db.assets.find({
      selector: {
        marketCap: { $gt: 0 }
      },
      sort: [{ marketCap: 'desc' }]
    })
      .then(res => res.docs)
      .then(async assets => {
        const allWallets = await this.walletService.getWallets()
        return Promise.map(assets, async asset => {
          const { symbol } = asset
          const wallets = allWallets.filter(w => w.symbol === symbol)
          const balance = await this.txService.getTotalBalance({ symbol, wallets })
          return Object.assign(asset, { balance })
        }, { concurrency: 10 })
      })
  }
}
