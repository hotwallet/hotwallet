import hwClient from '../lib/hotwalletClient'

export default class AssetService {
  constructor({ state, accountService }) {
    this.state = state
    this.accountService = accountService
  }

  getPriceHistory(symbol) {

  }

  update(symbol, data) {
    this.state.set(['assets', symbol], data)
  }

  async importAssets() {
    const baseCurrency = 'USD'
    const response = await hwClient.get('/securities', {
      baseCurrency,
      limit: 2000
    })
    const assets = {}
    response
      .sort((a, b) => b.marketCap - a.marketCap)
      .forEach(asset => {
        assets[`${asset.symbol}`] = asset
      })
    this.state.set('assets', assets)
  }
}
