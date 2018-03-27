import { getPriceHistoryData } from './portfolio/index'

export const ADD_MANUAL_TRANSACTION = 'ADD_TRANSACTION'

export const addTransaction = transaction => (dispatch, getState) => {
  dispatch({
    type: ADD_MANUAL_TRANSACTION,
    transaction
  })
  getPriceHistoryData()(dispatch, getState)
}
