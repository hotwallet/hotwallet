import { combineReducers } from 'redux'
import binance from './binance'
import ephemeral from './ephemeral'
import ledger from './ledger'
import portfolio from './portfolio'
import prices from './prices'
import securities from './securities'
import transactions from './transactions'
import user from './user'
import wallets from './wallets'

export default combineReducers({
  binance,
  ephemeral,
  ledger,
  portfolio,
  prices,
  securities,
  transactions,
  user,
  wallets
})
