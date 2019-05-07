export default class TransactionService {
  constructor({ db }) {
    this.db = db
  }

  addTransaction() {

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

  getTransactions(accountId, walletId) {

  }
}
