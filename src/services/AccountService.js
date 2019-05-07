const defaultSettings = {
  showBlankBalances: true,
  portfolioChartPeriod: '1 year'
}

const include_docs = true

export default class AccountService {
  constructor({ db }) {
    this.db = db
  }

  async getPrimaryAccount() {
    const { rows } = await this.db.accounts.allDocs({ include_docs })
    const accounts = rows.map(row => row.doc)
    const primaryAccount = accounts.find(account => account.isPrimary)
    return primaryAccount || this.createAccount({ isPrimary: true })
  }

  setPrimaryAccount(accountId) {

  }

  getAccountValue() {
    return this.db.transactions
  }

  getAccountValueHistory() {

  }

  async createAccount({ isPrimary }) {
    const mnemonic = this.generateMnemonic()
    return this.db.accounts.post({
      baseCurrency: 'USD',
      mnemonic, // TODO: encrypt
      isPrimary
    })
  }

  generateMnemonic() {
    return 'correct horse battery staple'
  }

  decryptMnemonic() {

  }

  encrypt() {

  }

  decrypt() {

  }
}
