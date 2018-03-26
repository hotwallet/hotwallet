/**
 * state.app is ephemeral data that will not be saved to localStorage
 */

import {
  SET_DEVICE,
  FILTER_SYMBOLS
} from '../actions/app'

const initialState = {
  device: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DEVICE:
      return { ...state, ...action.device }
    case FILTER_SYMBOLS:
      return { ...state, filterSymbolsQuery: action.query }
    default:
      return {
        device: {},
        ...state
      }
  }
}
