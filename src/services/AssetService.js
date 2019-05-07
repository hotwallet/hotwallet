import hwClient from '../lib/hotwalletClient'

export default class AssetService {
  constructor ({ db, accountService }) {
    this.db = db
    this.accountService = accountService
  }

  getAssets(query) {
    return this.db.assets.find(query)
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

  async importAssets() {
    const primaryAccount = await this.accountService.getPrimaryAccount()
    const { baseCurrency } = primaryAccount
    const assets = (await hwClient.get('/securities', { 
      baseCurrency, 
      limit: 2000 
    })).map(asset => ({
      _id: asset.symbol,
      ...asset,
    }))
    return this.db.assets.bulkDocs(assets)
  }
}