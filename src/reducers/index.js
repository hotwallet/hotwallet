import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import app from './app'
import binance from './binance'
import portfolio from './portfolio'
import prices from './prices'
import securities from './securities'
import transactions from './transactions'
import user from './user'
import wallets from './wallets'

export default combineReducers({
  app,
  binance,
  portfolio,
  prices,
  router,
  securities,
  transactions,
  user,
  wallets
})
