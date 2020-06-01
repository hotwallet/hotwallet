import { getPriceKey } from './portfolio'
import { state } from 'venti'

export const setPrices = (prices) => {
  const newPrices = prices.reduce((prices, data) => {
    const { symbol, baseCurrency, date, price } = data
    prices[getPriceKey({ symbol, baseCurrency, date })] = price
    return prices
  }, {})
  state.set('prices', { ...state.get('prices', {}), ...newPrices })
}

export const clearPrices = () => {
  state.set('prices', {})
}
