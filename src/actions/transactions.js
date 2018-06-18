import { refreshChart } from './portfolio'
import { v4 } from 'uuid'
import { getTransactionsForSymbol } from '../selectors/transactionSelectors'

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
export const REMOVE_TRANSACTIONS = 'REMOVE_TRANSACTIONS'

const removeTransactionsAfterNewTx = newTx => (dispatch, getState) => {
  const state = getState()
  const txs = getTransactionsForSymbol(state, newTx.symbol) || []
  const txIdsToRemove = txs.filter(tx => {
    return tx.txTime >= newTx.txTime && tx.walletId === newTx.walletId
  }).map(tx => tx.id)
  removeTransactions(txIdsToRemove)(dispatch, getState)
}

export const removeManualTransactions = symbol => (dispatch, getState) => {
  const state = getState()
  const txs = getTransactionsForSymbol(state, symbol) || []
  const txIdsToRemove = txs.filter(tx => tx.walletId === 'manual').map(tx => tx.id)
  removeTransactions(txIdsToRemove)(dispatch, getState)
}

export const addManualTransaction = tx => (dispatch, getState) => {
  const walletId = 'manual'
  const newTx = {
    id: v4(),
    ...tx,
    txTime: tx.txTime || new Date().toISOString(),
    balance: Number(tx.balance),
    walletId
  }
  removeTransactionsAfterNewTx(newTx)(dispatch, getState)
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
  refreshChart()(dispatch, getState)
}

export const removeTransaction = txId => (dispatch, getState) => {
  removeTransactions([txId])(dispatch, getState)
}

export const removeTransactions = txIds => (dispatch, getState) => {
  dispatch({
    type: REMOVE_TRANSACTIONS,
    txIds
  })
  refreshChart()(dispatch, getState)
}
