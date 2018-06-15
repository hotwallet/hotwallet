export const SET_PRICES = 'SET_PRICES'
export const CLEAR_PRICES = 'CLEAR_PRICES'

export const setPrices = prices => ({ type: SET_PRICES, prices })
export const clearPrices = () => ({ type: CLEAR_PRICES })
