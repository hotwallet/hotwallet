import { UPDATE_HISTORICAL_PRICES } from '../actions/prices'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_HISTORICAL_PRICES:
      return action.prices
    default:
      return state
  }
}
