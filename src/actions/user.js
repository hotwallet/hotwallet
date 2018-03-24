import { fetchSecurities } from './securities'

export const SET_BASE_CURRENCY = 'SET_BASE_CURRENCY'

export const setBaseCurrency = currency => (dispatch, getState) => {
  dispatch({
    type: SET_BASE_CURRENCY,
    currency
  })
  fetchSecurities()(dispatch, getState)
}
