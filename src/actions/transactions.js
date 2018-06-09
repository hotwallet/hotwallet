import { getPriceHistoryData } from './portfolio/index'
import { v4 } from 'uuid'

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
export const REMOVE_TRANSACTIONS = 'REMOVE_TRANSACTIONS'

export const addManualTransaction = tx => (dispatch, getState) => {
  const walletId = 'manual'
  const txTime = new Date().toISOString()
  const newTx = {
    id: v4(),
    txTime,
    ...tx,
    balance: Number(tx.balance),
    walletId
  }
  addTransactions([newTx])(dispatch, getState)
}

export const addBinanceTransaction = tx => (dispatch, getState) => {
  const walletId = 'Binance'
  const txTime = new Date().toISOString()
  const newTx = {
    id: v4(),
    txTime,
    ...tx,
    balance: Number(tx.balance),
    walletId
  }
  addTransactions([newTx])(dispatch, getState)
}

export const addTransactions = txs => (dispatch, getState) => {
  dispatch({
    type: ADD_TRANSACTIONS,
    txs
  })
  getPriceHistoryData()(dispatch, getState)
}

export const removeTransaction = txId => (dispatch, getState) => {
  removeTransactions([txId])(dispatch, getState)
}

export const removeTransactions = txIds => (dispatch, getState) => {
  dispatch({
    type: REMOVE_TRANSACTIONS,
    txIds
  })
}
