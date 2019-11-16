export default class WalletService {
  constructor({ state, accountService }) {
    this.state = state
    this.accountService = accountService
  }

  getAddress(symbol, address) {
    return this.state.get(`wallets.${symbol}.${address}.addresses.${address}`)
  }

  saveAddress(walletId, address, {
    isChange = false,
    isSpent = false,
    tags = [],
    pkey = null,
    balance = 0,
    memo = ''
  }) {
    const [symbol, walletAddress] = walletId.split(':')
    this.state.set(`wallets.${symbol}.${walletAddress}.addresses.${address}`, {
      isChange,
      isSpent,
      tags,
      pkey,
      balance,
      memo
    })
  }

  addWallet({
    symbol,
    address,
    xpub = null,
    isManual = false,
    name = null
  }) {
    if (!symbol) throw new Error('addWallet: symbol is required')
    if (!address) throw new Error('addWallet: address is required')
    const path = `wallets.${symbol}.${address}`
    const existingWallet = this.state.get(path)
    if (existingWallet) throw new Error('addWallet: wallet already exists')
    const walletId = `${symbol}:${address}`
    this.state.set(path, {
      id: walletId,
      xpub,
      isManual,
      name
    })
    this.saveAddress(walletId, address)
  }

  getWallet({ symbol, address }) {
    return this.state.get(`wallets.${symbol}.${address}`)
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
