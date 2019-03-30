import client from '../lib/hotwalletClient'

export const SET_PRICES = 'SET_PRICES'
export const CLEAR_PRICES = 'CLEAR_PRICES'
export const UPDATE_HISTORICAL_PRICES = 'UPDATE_HISTORICAL_PRICES'

export const setPrices = prices => ({ type: SET_PRICES, prices })
export const clearPrices = () => ({ type: CLEAR_PRICES })

export const getHistoricalPrices = symbol => (dispatch, getState) => {
  const baseCurrency = getState().user.baseCurrency
  client.get('/prices', {
    baseCurrency,
    symbols: symbol,
    startDate: '2010-03-30',
    endDate: '2019-03-30'
  })
    .then(prices => {
      dispatch({
        type: UPDATE_HISTORICAL_PRICES,
        prices
      })
    })
}
