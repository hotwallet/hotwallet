import { ADD_TRANSACTIONS, REMOVE_TRANSACTIONS } from '../actions/transactions'
import { combineReducers } from 'redux'
import * as helpers from './helpers'

const allTransactions = (state = [], action) => {
  switch (action.type) {
    case ADD_TRANSACTIONS:
      return helpers.addToIdList(state, action.txs, 'id')
    case REMOVE_TRANSACTIONS: {
      return helpers.removeFromIdList(state, action.txIds)
    }
    default:
      return state
  }
}

const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_TRANSACTIONS:
      return helpers.addToOneToOneMapping(state, action.txs, 'id')
    case REMOVE_TRANSACTIONS:
      return helpers.removeFromOneToOneMapping(state, action.txIds, 'id')
    default:
      return state
  }
}

const bySymbol = (state = {}, action) => {
  switch (action.type) {
    case ADD_TRANSACTIONS:
      return helpers.addToOneToManyMapping(state, action.txs, 'symbol')
    case REMOVE_TRANSACTIONS:
      return helpers.removeFromOneToManyMapping(state, action.txIds, 'id')
    default:
      return state
  }
}

const byWalletId = (state = {}, action) => {
  switch (action.type) {
    case ADD_TRANSACTIONS:
      return helpers.addToOneToManyMapping(state, action.txs, 'walletId')
    case REMOVE_TRANSACTIONS:
      return helpers.removeFromOneToManyMapping(state, action.txIds, 'id')
    default:
      return state
  }
}

export default combineReducers({allTransactions, byId, bySymbol, byWalletId})
