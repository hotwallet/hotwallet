export const ADD_MANUAL_TRANSACTION = 'ADD_TRANSACTION'

export const addTransaction = transaction => ({
  type: ADD_MANUAL_TRANSACTION,
  transaction
})
