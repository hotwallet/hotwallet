import Promise from 'bluebird'

export default class TransactionService {
  constructor({ db, walletService }) {
    this.db = db
    this.walletService = walletService
  }

  addTransaction() {
    // after adding tx, update the wallet's balance
  }

  removeTransaction() {

  }

  updateTransaction() {

  }

  async getBalance({ walletId, symbol }) {
    const latestTx = await this.db.transactions.find({
      selector: { walletId, symbol, date: { $exists: true } },
      sort: [{ date: 'desc' }],
      limit: 1
    })
    return latestTx.balance
  }

  async getTotalBalance({ symbol, wallets }) {
    if (!Array.isArray(wallets)) throw new Error('getTotalBalance: wallets must be an array')
    let total = 0
    await Promise.map(wallets, async wallet => {
      const walletId = wallet._id
      const balance = await this.getBalance({ walletId, symbol })
      total += balance
    })
    return total
  }

  getTransactions(accountId, walletId) {

  }
}
