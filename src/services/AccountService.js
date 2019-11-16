import uuid from 'uuid'
import { Object } from 'core-js'

export default class AccountService {
  constructor({ state }) {
    this.state = state
  }

  getPrimaryAccount() {
    const accounts = this.state.get('accounts')
    const primaryAccountId = Object.keys(accounts).find(id => accounts[id].isPrimary)
    return accounts[primaryAccountId]
  }

  setPrimaryAccount(accountId) {
    const accounts = this.state.get('accounts')
    Object.keys(accounts).forEach(id => {
      this.state.set(`accounts.${id}.isPrimary`, id === accountId)
    })
  }

  getAccountValue() {

  }

  getAccountValueHistory() {

  }

  createAccount() {
    const mnemonic = this.generateMnemonic()
    const accountId = uuid()
    this.state.set(`accounts.${accountId}`, {
      baseCurrency: 'USD',
      mnemonic // TODO: encrypt
    })
    this.setPrimaryAccount(accountId)
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
