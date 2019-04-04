import client from '../lib/hotwalletClient'
import { normalize } from 'normalizr'
import * as schema from './schema'
import debounce from 'lodash/debounce'

export const SECURITIES_FETCH = 'SECURITIES_FETCH'
export const SECURITIES_FETCH_SUCCESS = 'SECURITIES_FETCH_SUCCESS'
export const SECURITIES_FETCH_FAILURE = 'SECURITIES_FETCH_FAILURE'
export const SECURITIES_UPDATE = 'SECURITIES_UPDATE'
export const SECURITIES_BALANCES_ONLY = 'SECURITIES_BALANCES_ONLY'

function populateLastUpdated(securities) {
  return securities.map(security => ({
    ...security,
    lastUpdated: (new Date()).toISOString()
  }))
}

const fetchSecuritiesDebounced = debounce((dispatch, getState) => {
  dispatch({
    type: SECURITIES_FETCH
  })

  const baseCurrency = getState().user.baseCurrency
  client.get('/securities', { baseCurrency, limit: 2000 })
    .then(securities => {
      const populatedSecurities = populateLastUpdated(securities)
      dispatch({
        type: SECURITIES_FETCH_SUCCESS,
        response: normalize(populatedSecurities, schema.arrayOfSecurities)
      })
    })
    .catch(error => {
      dispatch({
        type: SECURITIES_FETCH_FAILURE,
        message: error.message || 'Unknown price fetch failure'
      })
    })
}, 1000)

export const fetchSecurities = () => fetchSecuritiesDebounced

export const updateSecurity = security => ({
  type: SECURITIES_UPDATE,
  security
})

export const showBalancesOnly = balancesOnly => ({
  type: SECURITIES_BALANCES_ONLY,
  balancesOnly
})
