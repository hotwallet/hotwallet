import { fetchSecurities } from './securities'

export const SET_BASE_CURRENCY = 'SET_BASE_CURRENCY'

export const setBaseCurrency = currency => (dispatch, getState) => {
  const originalCurrency = getState().user.baseCurrency

  dispatch({
    type: SET_BASE_CURRENCY,
    currency
  })

  if (currency !== originalCurrency) {
    fetchSecurities()(dispatch, getState)
  }
}
