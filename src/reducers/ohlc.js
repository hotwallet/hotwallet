import { UPDATE_OHLC_DATA } from '../actions/prices'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_OHLC_DATA:
      return action.data
    default:
      return state
  }
}
