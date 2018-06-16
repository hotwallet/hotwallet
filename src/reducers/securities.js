import { combineReducers } from 'redux'
import {
  SECURITIES_FETCH,
  SECURITIES_FETCH_SUCCESS,
  SECURITIES_FETCH_FAILURE,
  SECURITIES_UPDATE,
  SECURITIES_BALANCES_ONLY
} from '../actions/securities'

const allSymbols = (state = [], action) => {
  switch (action.type) {
    case SECURITIES_FETCH_SUCCESS:
      return [
        ...action.response.result
      ]
    // case SECURITIES_UPDATE:
    //   if (state.indexOf(action.security.result) === -1) {
    //     return [
    //       ...state,
    //       action.security.result
    //     ]
    //   }
    //   return state
    default:
      return state
  }
}

const bySymbol = (state = {}, action) => {
  switch (action.type) {
    case SECURITIES_FETCH_SUCCESS:
      return {
        ...state,
        ...action.response.entities.security
      }

    case SECURITIES_UPDATE:
      const symbol = Object.keys(action.security.entities.security)[0]
      if (state[symbol].price === action.security.entities.security[symbol].price) {
        return state
      }
      return {
        ...state,
        ...action.security.entities.security
      }

    default:
      return state
  }
}

const metadata = (state = {}, action) => {
  const now = new Date().toISOString()
  switch (action.type) {
    case SECURITIES_FETCH:
      return {
        ...state,
        isFetching: true
      }

    case SECURITIES_FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        updatedAt: now,
        failureMessage: undefined
      }

    case SECURITIES_FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        failureMessage: action.message
      }

    case SECURITIES_UPDATE:
      return {
        ...state,
        updatedAt: now,
        failureMessage: undefined
      }

    case SECURITIES_BALANCES_ONLY:
      return {
        ...state,
        balancesOnly: action.balancesOnly
      }

    default:
      return state
  }
}

export default combineReducers({allSymbols, bySymbol, metadata})
