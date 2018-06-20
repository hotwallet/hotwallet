/**
 * state.app is ephemeral data that will not be saved to localStorage
 */

import {
  SET_DEVICE,
  FILTER_SYMBOLS,
  SET_ROW_SLICE
} from '../actions/app'

const initialState = {
  device: {},
  rowSlice: [0, 1000]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DEVICE:
      return { ...state, ...action.device }
    case FILTER_SYMBOLS:
      return { ...state, filterSymbolsQuery: action.query }
    case SET_ROW_SLICE:
      const [first, last] = state.rowSlice || []
      const [newFirst, newLast] = action.rowSlice
      if (first === newFirst && last === newLast) {
        return state
      }
      return { ...state, rowSlice: action.rowSlice }
    default:
      return {
        device: {},
        ...state
      }
  }
}
