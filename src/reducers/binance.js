/**
 * state.app is ephemeral data that will not be saved to localStorage
 */

import {
  SET_BINANCE_API_KEYS,
  SET_BINANCE_SYNC_TIME
} from '../actions/binance'

const initialState = {
  apiKey: '',
  secretKey: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BINANCE_API_KEYS:
      return { ...state, ...action.keys }
    case SET_BINANCE_SYNC_TIME:
      return { ...state, lastSync: Date.now() }
    default:
      return {
        ...state
      }
  }
}
