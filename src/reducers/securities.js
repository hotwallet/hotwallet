import {
  SECURITIES_FETCH,
  SECURITIES_FETCH_SUCCESS,
  SECURITIES_FETCH_FAILURE,
  SECURITIES_UPDATE
} from '../actions'

const initialState = {}

export const getSecurities = function (state) {
  return state.securities
}

export const getIsFetching = function (state) {
  return state.isFetching
}

export const getFailureMessage = function (state) {
  return state.failureMessage
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SECURITIES_FETCH:
      return { ...state, isFetching: true }
    case SECURITIES_FETCH_SUCCESS:
      return { securities: action.response, isFetching: false }
    case SECURITIES_FETCH_FAILURE:
      return { ...state, isFetching: false, failureMessage: action.message }
    case SECURITIES_UPDATE:
      const symbol = action.security.symbol
      const securities = state.securities.map(security => {
        return (security.symbol === symbol) ? action.security : security
      })
      return { ...state, securities }
    default:
      return state
  }
}
