import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counter from './counter'
import securities, * as securitiesReducer from './securities'

export const getIsFetching = function (state, reducerName) {
  return state[reducerName] && state[reducerName].isFetching
}

export const getSecurities = function (state) {
  return securitiesReducer.getSecurities(state.securities)
}

export default combineReducers({
  router: routerReducer,
  securities: securities,
  counter
})
