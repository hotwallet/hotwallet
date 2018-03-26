export const SET_DEVICE = 'SET_DEVICE'
export const FILTER_SYMBOLS = 'FILTER_SYMBOLS'

export const setDevice = (device) => ({ type: SET_DEVICE, device })

export const filterSymbols = query => ({
  type: FILTER_SYMBOLS,
  query
})
