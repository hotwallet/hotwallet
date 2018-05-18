import { getPriceHistoryData } from './portfolio/index'
import { v4 } from 'uuid'

export const ADD_TRANSACTION = 'ADD_TRANSACTION'

export const addTransaction = transaction => (dispatch, getState) => {
  const walletId = 'manual'
  const txTime = new Date().toISOString()
  const newTx = {
    id: v4(),
    txTime,
    ...transaction,
    balance: Number(transaction.balance),
    walletId
  }

  dispatch({
    type: ADD_TRANSACTION,
    transaction: newTx
  })
  getPriceHistoryData()(dispatch, getState)
}
