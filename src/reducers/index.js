import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import app from './app'
import securitiesReducer, * as securities from './securities'
import portfolio from './portfolio'
import user from './user'
import transactions from './transactions'

// selectors
export const getIsFetchingSecurities = function (state) {
  return securities.getIsFetching(state.securities)
}

export const getSecurities = function (state) {
  return securities.getSecurities(state.securities)
}

export const getSecuritiesFailure = function (state) {
  return securities.getFailureMessage(state.securities)
}

// reducers
export default combineReducers({
  app,
  portfolio,
  transactions,
  user,
  router: routerReducer,
  securities: securitiesReducer
})
