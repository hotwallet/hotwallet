import { ADD_MANUAL_TRANSACTION } from '../actions/transactions'
import find from 'lodash/find'
import { v4 } from 'uuid'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_MANUAL_TRANSACTION:
      const walletId = 'manual'
      const txTime = new Date()
      const newTx = {
        id: v4(),
        txTime,
        ...action.transaction,
        walletId
      }
      const symbol = newTx.symbol
      const existingTx = find(state, { symbol, txTime, walletId })
      if (existingTx) {
        return state.map(tx => tx.id === existingTx.id ? newTx : tx)
      }
      return [newTx, ...state]
    default:
      return state
  }
}
