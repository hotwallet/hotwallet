import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import connect from './pouchdb-connect'

PouchDB.plugin(PouchDBFind)

const db = {
  accounts: new PouchDB('accounts'),
  assets: new PouchDB('assets'),
  prices: new PouchDB('prices'),
  transactions: new PouchDB('transactions'),
  wallets: new PouchDB('wallets')
}

// db.assets.createIndex({ index: { fields: ['symbol'] } })
db.assets.createIndex({ index: { fields: ['marketCap'] } })

db.prices.createIndex({ index: { fields: ['symbol', 'date'] } })

db.transactions.createIndex({ index: { fields: ['walletId', 'symbol', 'date'] } })

db.wallets.createIndex({ index: { fields: ['accountId', 'symbol'] } })

export default db

export const connectAccounts = connect(db.accounts)
export const connectAssets = connect(db.assets)
export const connectPrices = connect(db.prices)
