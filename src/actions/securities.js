import client from '../lib/tarragonClient'
import { getIsFetchingSecurities } from '../reducers'

export const SECURITIES_FETCH = 'SECURITIES_FETCH'
export const SECURITIES_FETCH_SUCCESS = 'SECURITIES_FETCH_SUCCESS'
export const SECURITIES_FETCH_FAILURE = 'SECURITIES_FETCH_FAILURE'
export const SECURITIES_UPDATE = 'SECURITIES_UPDATE'

export const fetchSecurities = () => (dispatch, getState) => {
  if (getIsFetchingSecurities(getState(), 'securities')) {
    return Promise.resolve()
  }

  dispatch({
    type: SECURITIES_FETCH
  })

  const baseCurrency = getState().user.baseCurrency
  client.get('/securities', { baseCurrency }).then(
    response => {
      dispatch({
        type: SECURITIES_FETCH_SUCCESS,
        response: response
      })
      client.socket.subscribeToPriceUpdates()
    },
    error => {
      dispatch({
        type: SECURITIES_FETCH_FAILURE,
        message: error.message || 'Unknown price fetch failure'
      })
    }
  )
}

export const updateSecurity = security => ({
  type: SECURITIES_UPDATE,
  security
})
