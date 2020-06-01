import { refreshChart } from './portfolio'
import { v4 } from 'uuid'
import { state } from 'venti'
import * as helpers from '../helpers/helpers'
import {
  getTransactionsForSymbol,
  getAllTransactions,
  getBalancesBySymbol
} from '../ventiSelectors/transactions'

const removeTransactionsAfterNewTx = newTx => {
  const txs = getTransactionsForSymbol(newTx.symbol) || []
  const txIdsToRemove = txs.filter(tx => {
    return tx.txTime >= newTx.txTime && tx.walletId === newTx.walletId
  }).map(tx => tx.id)
  removeTransactions(txIdsToRemove)
}

export const removeManualTransactions = symbol => {
  const txs = getTransactionsForSymbol(symbol) || []
  const txIdsToRemove = txs.filter(tx => tx.walletId === 'manual').map(tx => tx.id)
  removeTransactions(txIdsToRemove)
}

export const addManualTransaction = tx => {
  const walletId = 'manual'
  const newTx = {
    id: v4(),
    ...tx,
    txTime: tx.txTime || new Date().toISOString(),
    balance: Number(tx.balance),
    walletId
  }
  removeTransactionsAfterNewTx(newTx)
  addTransactions([newTx])
}

export const addImportedTransaction = tx => {
  const txTime = new Date().toISOString()
  const newTx = {
    id: v4(),
    txTime,
    ...tx,
    balance: Number(tx.balance)
  }
  addTransactions([newTx])
}

export const addTransactions = txs => {
  state.set('transactions.byId', helpers.addToOneToOneMapping(state.get('transactions.byId'), txs, 'id'))
  state.set('transactions.bySymbol', helpers.addToOneToManyMapping(state.get('transactions.bySymbol'), txs, 'symbol'))
  state.set('transactions.byWalletId', helpers.addToOneToManyMapping(state.get('transactions.byWalletId'), txs, 'walletId'))
  refreshChart()
}

export const removeTransaction = txId => {
  removeTransactions([txId])
}

export const removeTransactions = txIds => {
  state.set('transactions.byId', helpers.removeFromOneToOneMapping(state.get('transactions.byId'), txIds, 'id'))
  state.set('transactions.bySymbol', helpers.removeFromOneToManyMapping(state.get('transactions.bySymbol'), txIds, 'symbol'))
  state.set('transactions.byWalletId', helpers.removeFromOneToManyMapping(state.get('transactions.byWalletId'), txIds, 'walletId'))
  refreshChart()
}

export const getTransactions = () => {
  return getAllTransactions()
}

export const getBalances = () => {
  return getBalancesBySymbol()
}
