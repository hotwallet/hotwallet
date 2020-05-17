import { combineReducers } from 'redux'
import ephemeral from './ephemeral'
import portfolio from './portfolio'
import securities from './securities'
import transactions from './transactions'
import wallets from './wallets'

export default combineReducers({
  ephemeral,
  portfolio,
  securities,
  transactions,
  wallets
})
