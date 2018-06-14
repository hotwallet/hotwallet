import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import moment from 'moment'
import _set from 'lodash/set'
import _get from 'lodash/get'

export const getTransactionsById = state => state.transactions.byId

export const getTransactionsBySymbol = state => state.transactions.bySymbol

export const getTransactionsBySymbolSlice = createSelector(
  [getTransactionsBySymbol],
  txbs => ({transactions: {bySymbol: txbs}})
)

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
  [getTransactionsBySymbolSlice],
  (bySymbolSlice) => {
    const balancesBySymbol = {}
    const symbols = Object.keys(bySymbolSlice.transactions.bySymbol)
    symbols.forEach(symbol => {
      balancesBySymbol[symbol] = getBalanceForSymbol(bySymbolSlice, symbol)
    })
    return balancesBySymbol
  }
)

export const getDailyBalances = createSelector(
  [getAllTransactions],
  (transactions) => {
    if (!transactions) return {}
    const DATE_FORMAT = 'YYYY-MM-DD'
    // determine daily wallet balances and symbols
    const walletBalances = {}
    const symbols = {}
    transactions.forEach(tx => {
      if (!tx.txTime) return
      const date = moment(tx.txTime).format(DATE_FORMAT)
      const symbol = tx.symbol
      symbols[symbol] = true
      const walletId = tx.walletId
      _set(walletBalances, [date, symbol, walletId], Number(tx.balance))
    })
    // determine daily symbol balances and the date of the first transaction
    const symbolBalances = {}
    let startDate = moment().format(DATE_FORMAT)
    Object.keys(walletBalances).forEach(date => {
      startDate = (date < startDate) ? date : startDate
      Object.keys(walletBalances[date]).forEach(symbol => {
        Object.keys(walletBalances[date][symbol]).forEach(walletId => {
          const balance = _get(symbolBalances, [date, symbol], 0)
          const walletBalance = _get(walletBalances, [date, symbol, walletId])
          _set(symbolBalances, [date, symbol], balance + walletBalance)
        })
      })
    })
    // populate balances for each day using sparse symbolBalances
    const dailyBalances = {}
    for (let m = moment(startDate); m.isBefore(); m.add(1, 'days')) {
      const date = m.format(DATE_FORMAT)
      const prevDate = moment(m).subtract(1, 'days').format(DATE_FORMAT)
      dailyBalances[date] = symbolBalances[date] || {}
      Object.keys(symbols).forEach(symbol => {
        if (dailyBalances[date][symbol] === undefined) {
          dailyBalances[date][symbol] = _get(dailyBalances, [prevDate, symbol], 0)
        }
      })
    }
    return dailyBalances
  }
)
