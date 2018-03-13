import client from '../lib/tarragonClient.js'
import { getIsFetching } from '../reducers'

export const fetchSecurities = () => (dispatch, getState) => {
  if (getIsFetching(getState(), 'securities')) {
    return Promise.resolve()
  }

  dispatch({
    type: 'securities.fetch'
  })

  client.get('/securities').then(
    response => {
      dispatch({
        type: 'securities.fetchSuccess',
        response: response
      })
    },
    error => {
      dispatch({
        type: 'securities.fetchFailure',
        message: error.message || 'Unknown price fetch failure'
      })
    }
  )
}
