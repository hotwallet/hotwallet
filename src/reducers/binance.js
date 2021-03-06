import {
  SET_BINANCE_API_KEYS,
  SET_BINANCE_SYNC_TIME,
  SET_BINANCE_ERROR_MESSAGE
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
    case SET_BINANCE_ERROR_MESSAGE:
      return { ...state, errorMessage: action.errorMessage }
    default:
      return state
  }
}
