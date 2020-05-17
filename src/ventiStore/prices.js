import { getPriceKey } from './portfolio'
import { state } from 'venti'

export default state.set('prices', {
})

export const setPrices = prices => {
  console.log('setPrices, prices --->>>', prices)
  const newPrices = prices.reduce((prices, data) => {
    const { symbol, baseCurrency, date, price } = data
    prices[getPriceKey({ symbol, baseCurrency, date })] = price
    return prices
  }, {})
  state.set('prices', newPrices)
}

export const clearPrices = () => {
  state.set('prices', {})
}
