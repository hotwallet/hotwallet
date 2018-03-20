import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counterReducer, * as counter from './counter'
import securitiesReducer, * as securities from './securities'
import portfolio from './portfolio'
import user from './user'

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

export const getCounter = function (state) {
  return counter.getCounter(state.counter)
}

// reducers
export default combineReducers({
  portfolio,
  user,
  router: routerReducer,
  securities: securitiesReducer,
  counter: counterReducer
})
