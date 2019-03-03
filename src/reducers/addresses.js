import {
  UPDATE_ADDRESS
} from '../actions/addresses'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ADDRESS:
      const { symbol, address } = action.data
      const addressId = `${symbol}:${address}`
      return {
        ...state,
        [addressId]: action.data
      }
    default:
      return state
  }
}
