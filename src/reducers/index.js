import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import app from './app'
import binance from './binance'
import securities from './securities'
import portfolio from './portfolio'
import user from './user'
import transactions from './transactions'

export default combineReducers({
  app,
  binance,
  portfolio,
  transactions,
  user,
  router,
  securities
})
