import { ADD_TRANSACTION } from '../actions/transactions'
import { combineReducers } from 'redux'

const allTransactions = (state = [], action) => {
  let tx = action.transaction
  switch (action.type) {
    case ADD_TRANSACTION:
      if (state.filter(txId => txId === tx.id).length > 0) {
        return state
      }
      return [...state, tx.id]
    default:
      return state
  }
}

const byId = (state = {}, action) => {
  let tx = action.transaction
  switch (action.type) {
    case ADD_TRANSACTION:
      return {...state, [tx.id]: tx}
    default:
      return state
  }
}

const bySymbol = (state = {}, action) => {
  let tx = action.transaction
  switch (action.type) {
    case ADD_TRANSACTION:
      if (state[tx.symbol] !== undefined) {
        return {...state, [tx.symbol]: [...state[tx.symbol], tx]}
      }
      return {...state, [tx.symbol]: [tx]}

    default:
      return state
  }
}

const byWalletId = (state = {}, action) => {
  let tx = action.transaction
  switch (action.type) {
    case ADD_TRANSACTION:
      if (state[tx.walletId] !== undefined) {
        return {...state, [tx.walletId]: [...state[tx.walletId], tx]}
      }
      return {...state, [tx.walletId]: [tx]}

    default:
      return state
  }
}

export default combineReducers({allTransactions, byId, bySymbol, byWalletId})
