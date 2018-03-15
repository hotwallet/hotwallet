import client from '../lib/tarragonClient.js'
import { getIsFetchingSecurities } from '../reducers'
import { SECURITIES_FETCH, SECURITIES_FETCH_SUCCESS, SECURITIES_FETCH_FAILURE } from './types'

export const fetchSecurities = () => (dispatch, getState) => {
  if (getIsFetchingSecurities(getState(), 'securities')) {
    return Promise.resolve()
  }

  dispatch({
    type: SECURITIES_FETCH
  })

  client.get('/securities').then(
    response => {
      dispatch({
        type: SECURITIES_FETCH_SUCCESS,
        response: response
      })
    },
    error => {
      dispatch({
        type: SECURITIES_FETCH_FAILURE,
        message: error.message || 'Unknown price fetch failure'
      })
    }
  )
}
