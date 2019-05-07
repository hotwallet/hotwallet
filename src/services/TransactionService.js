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

  getBalance({ accountId, walletId, symbol }) {
    return this.db.transactions.find()
  }

  getTransactions(accountId, walletId) {

  }
}
