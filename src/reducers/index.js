import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import app from './app'
import binance from './binance'
import portfolio from './portfolio'
import prices from './prices'
import securities from './securities'
import user from './user'
import transactions from './transactions'

export default combineReducers({
  app,
  binance,
  portfolio,
  prices,
  transactions,
  user,
  router,
  securities
})
