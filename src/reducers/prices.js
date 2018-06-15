import { SET_PRICES, CLEAR_PRICES } from '../actions/prices'
import { getPriceKey } from '../actions/portfolio'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PRICES:
      const newPrices = action.prices.reduce((prices, data) => {
        const { symbol, baseCurrency, date, price } = data
        prices[getPriceKey({ symbol, baseCurrency, date })] = price
        return prices
      }, {})
      return { ...state, ...newPrices }
    case CLEAR_PRICES:
      return {}
    default:
      return state
  }
}
