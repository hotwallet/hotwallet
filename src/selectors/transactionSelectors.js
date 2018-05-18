import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'

export const getTransactionsById = state => state.transactions.byId

export const getTransactionsBySymbol = state => state.transactions.bySymbol

export const getTransactionBySymbolSlice = state => ({transactions: {bySymbol: state.transactions.bySymbol}})

export const getAllTransactions = createSelector([getTransactionsById], (byId) => Object.values(byId))

export const getTransactionsForSymbolUncached = (state, symbol) => state.transactions.bySymbol[symbol]

export const getTransactionsForSymbol = createCachedSelector(
  [getTransactionsForSymbolUncached],
  transactions => transactions
)((state, symbol) => symbol)

export const getBalanceForSymbol = createCachedSelector(
  [getTransactionsForSymbol],
  (transactions) => {
    if (!transactions) {
      return undefined
    }

    const balancesByWalletId = {}
    transactions.forEach(tx => {
      balancesByWalletId[tx.walletId] = tx.balance
    })

    let balance = 0
    Object.values(balancesByWalletId).forEach(walletBalance => {
      balance += walletBalance
    })
    return balance
  }
)(
  (state, symbol) => symbol
)

export const getBalancesBySymbol = createSelector(
  [getTransactionBySymbolSlice],
  (bySymbolSlice) => {
    const balancesBySymbol = {}
    const symbols = Object.keys(bySymbolSlice.transactions.bySymbol)
    symbols.forEach(symbol => {
      balancesBySymbol[symbol] = getBalanceForSymbol(bySymbolSlice, symbol)
    })
    return balancesBySymbol
  }
)
