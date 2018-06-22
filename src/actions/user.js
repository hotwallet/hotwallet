import { fetchSecurities } from './securities'
import { clearPrices } from './prices'
import { refreshChart } from './portfolio'
import client from '../lib/tarragonClient'

export const SET_BASE_CURRENCY = 'SET_BASE_CURRENCY'

export const setBaseCurrency = currency => (dispatch, getState) => {
  const originalCurrency = getState().user.baseCurrency

  dispatch(clearPrices())

  dispatch({
    type: SET_BASE_CURRENCY,
    currency
  })

  client.socket.syncSubscriptions()

  refreshChart()(dispatch, getState)

  if (currency !== originalCurrency) {
    fetchSecurities()(dispatch, getState)
  }
}
