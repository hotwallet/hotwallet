import { ADD_MANUAL_TRANSACTION } from '../actions/transactions'
import find from 'lodash/find'
import moment from 'moment'
import { v4 } from 'uuid'

const initialState = []

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_MANUAL_TRANSACTION:
      const isManual = true
      const date = moment().format('YYYY-MM-DD')
      const newTx = {
        id: v4(),
        date,
        ...action.transaction,
        isManual
      }
      const symbol = newTx.symbol
      const existingTx = find(state, { symbol, date, isManual })
      if (existingTx) {
        return state.map(tx => tx.id === existingTx.id ? newTx : tx)
      }
      return [newTx, ...state]
    default:
      return state
  }
}
