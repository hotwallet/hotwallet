import client from '../lib/hotwalletClient'

export const SET_PRICES = 'SET_PRICES'
export const CLEAR_PRICES = 'CLEAR_PRICES'
export const UPDATE_OHLC_DATA = 'UPDATE_OHLC_DATA'

export const setPrices = prices => ({ type: SET_PRICES, prices })
export const clearPrices = () => ({ type: CLEAR_PRICES })

export const getOHLC = symbol => (dispatch, getState) => {
  const baseCurrency = getState().user.baseCurrency
  client.get('/ohlc', {
    baseCurrency,
    symbol,
    startDate: '2010-03-30',
    endDate: '2019-03-30'
  })
    .then(data => {
      dispatch({
        type: UPDATE_OHLC_DATA,
        data
      })
    })
}
