import client from '../lib/tarragonClient'
import { normalize } from 'normalizr'
import * as schema from './schema'

export const SECURITIES_FETCH = 'SECURITIES_FETCH'
export const SECURITIES_FETCH_SUCCESS = 'SECURITIES_FETCH_SUCCESS'
export const SECURITIES_FETCH_FAILURE = 'SECURITIES_FETCH_FAILURE'
export const SECURITIES_UPDATE = 'SECURITIES_UPDATE'
export const SECURITIES_BALANCES_ONLY = 'SECURITIES_BALANCES_ONLY'

export const fetchSecurities = () => (dispatch, getState) => {
  dispatch({
    type: SECURITIES_FETCH
  })

  const baseCurrency = getState().user.baseCurrency
  client.get('/securities', { baseCurrency })
    .then(response => {
      dispatch({
        type: SECURITIES_FETCH_SUCCESS,
        response: normalize(response, schema.arrayOfSecurities)
      })
      client.socket.subscribeToPriceUpdates()
    })
    .catch(error => {
      dispatch({
        type: SECURITIES_FETCH_FAILURE,
        message: error.message || 'Unknown price fetch failure'
      })
    })
}

export const updateSecurity = security => ({
  type: SECURITIES_UPDATE,
  security
})

export const showBalancesOnly = balancesOnly => ({
  type: SECURITIES_BALANCES_ONLY,
  balancesOnly
})
