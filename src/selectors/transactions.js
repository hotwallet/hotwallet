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

export const getTransactionsForWalletUncached = (state, walletId) => state.transactions.byWalletId[walletId]

export const getSymbolsWithTransactions = createSelector(
  [getTransactionsBySymbol],
  (transactionsBySymbol) => Object.keys(transactionsBySymbol)
)

export const getTransactionsForSymbol = createCachedSelector(
  [getTransactionsForSymbolUncached],
  transactions => transactions
)((state, symbol) => symbol)

export const getTransactionsForWallet = createCachedSelector(
  [getTransactionsForWalletUncached],
  transactions => transactions
)((state, walletId) => walletId)

export const getBalancesForWallet = createCachedSelector(
  [getTransactionsForWallet],
  (transactions) => {
    if (!transactions) {
      return undefined
    }
    const balances = {}
    transactions.forEach(tx => {
      balances[tx.symbol] = tx.balance
    })
    return balances
  }
)(
  (state, walletId) => walletId
)

export const getBalancesByWalletIdForSymbol = createCachedSelector(
  [getTransactionsForSymbol],
  (transactions) => {
    if (!transactions) {
      return undefined
    }
    const balancesByWalletId = {}
    transactions.forEach(tx => {
      balancesByWalletId[tx.walletId] = tx.balance
    })
    return balancesByWalletId
  }
)(
  (state, symbol) => symbol
)

export const getBalanceForSymbol = createCachedSelector(
  [getBalancesByWalletIdForSymbol],
  balancesByWalletId => {
    if (!balancesByWalletId) {
      return undefined
    }
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
    // get the sparse daily balance of each wallet
    const walletBalances = {}
    const symbols = {}
    let firstTxDate = moment().format(DATE_FORMAT)
    transactions.forEach(tx => {
      if (!tx.txTime) return
      const date = moment(tx.txTime).format(DATE_FORMAT)
      firstTxDate = (date < firstTxDate) ? date : firstTxDate
      const symbol = tx.symbol
      const walletId = tx.walletId
      _set(symbols, [symbol, walletId], true)
      _set(walletBalances, [date, symbol, walletId], Number(tx.balance))
    })
    // get daily balances of each wallet (fill in sparse days where the balance was unchanged)
    const dailyWalletBalances = {}
    for (let m = moment(firstTxDate); m.isBefore(); m.add(1, 'days')) {
      const date = m.format(DATE_FORMAT)
      const prevDate = moment(m).subtract(1, 'days').format(DATE_FORMAT)
      dailyWalletBalances[date] = walletBalances[date] || {}
      Object.keys(symbols).forEach(symbol => {
        Object.keys(symbols[symbol]).forEach(walletId => {
          const walletBalance = _get(dailyWalletBalances, [date, symbol, walletId])
          if (walletBalance === undefined) {
            const previousDayBalance = _get(dailyWalletBalances, [prevDate, symbol, walletId], 0)
            _set(dailyWalletBalances, [date, symbol, walletId], previousDayBalance)
          }
        })
      })
    }
    // get the total daily balance for each symbol
    const dailyBalances = {}
    Object.keys(dailyWalletBalances).forEach(date => {
      Object.keys(dailyWalletBalances[date]).forEach(symbol => {
        Object.keys(dailyWalletBalances[date][symbol]).forEach(walletId => {
          const subtotal = _get(dailyBalances, [date, symbol], 0)
          const walletBalance = dailyWalletBalances[date][symbol][walletId]
          _set(dailyBalances, [date, symbol], subtotal + walletBalance)
        })
      })
    })
    return dailyBalances
  }
)
