import { fetchSecurities } from './securities'
import { clearPrices } from './prices'
import { refreshChart } from './portfolio'
import client from '../lib/hotwalletClient'

export const SET_BASE_CURRENCY = 'SET_BASE_CURRENCY'

export const setBaseCurrency = currency => (dispatch, getState) => {
  const originalCurrency = getState().user.baseCurrency

  if (currency !== originalCurrency) {
    dispatch(clearPrices())

    dispatch({
      type: SET_BASE_CURRENCY,
      currency
    })

    client.socket.syncSubscriptions()

    refreshChart()(dispatch, getState)
    fetchSecurities()(dispatch, getState)
  }
}
