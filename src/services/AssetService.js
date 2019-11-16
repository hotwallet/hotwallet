// import hwClient from '../lib/hotwalletClient'

export default class AssetService {
  constructor({ state, accountService }) {
    this.state = state
    this.accountService = accountService
  }

  getPriceHistory(symbol) {

  }

  async importAssets() {
    // const primaryAccount = await this.accountService.getPrimaryAccount()
    // const { baseCurrency } = primaryAccount
    // const assets = (await hwClient.get('/securities', {
    //   baseCurrency,
    //   limit: 2000
    // })).map(asset => ({
    //   _id: asset.symbol,
    //   ...asset
    // }))
    // TODO save to state
  }
}
