import moment from 'moment'
import _set from 'lodash/set'
import _get from 'lodash/get'

import { state } from 'venti'

export const getTransactionsById = () => state.get('transactions.byId', {})

export const getTransactionsBySymbol = () => state.get('transactions.bySymbol', {})

export const getTransactionsBySymbolSlice = () => ({ transactions: { bySymbol: getTransactionsBySymbol() } })

export const getAllTransactions = () => Object.values(getTransactionsById())

export const getTransactionsForSymbolUncached = (symbol) => state.get(`transactions.bySymbol.${symbol}`)

export const getTransactionsForWalletUncached = (walletId) => state.get(`transactions.byWalletId.${walletId}`)

export const getSymbolsWithTransactions = () => Object.keys(getTransactionsBySymbol())

export const getTransactionsForSymbol = getTransactionsForSymbolUncached

export const getTransactionsForWallet = getTransactionsForWalletUncached

export const getBalancesForWallet = walletId => {
  const transactions = getTransactionsForWallet(walletId)
  if (!transactions) {
    return undefined
  }
  const balances = {}
  transactions.forEach(tx => {
    balances[tx.symbol] = tx.balance
  })
  return balances
}

export const getBalancesByWalletIdForSymbol = symbol => {
  const transactions = getTransactionsForSymbol(symbol)
  if (!transactions) {
    return undefined
  }
  const balancesByWalletId = {}
  transactions.forEach(tx => {
    balancesByWalletId[tx.walletId] = tx.balance
  })
  return balancesByWalletId
}

export const getBalanceForSymbol = symbol => {
  const balancesByWalletId = getBalancesByWalletIdForSymbol(symbol)
  if (!balancesByWalletId) {
    return undefined
  }
  let balance = 0
  Object.values(balancesByWalletId).forEach(walletBalance => {
    balance += walletBalance
  })
  return balance
}

export const getBalancesBySymbol = symbol => {
  const bySymbolSlice = getTransactionsBySymbolSlice(symbol)
  const balancesBySymbol = {}
  const symbols = Object.keys(bySymbolSlice.transactions.bySymbol)
  symbols.forEach(symbol => {
    balancesBySymbol[symbol] = getBalanceForSymbol(symbol)
  })
  return balancesBySymbol
}

export const getDailyBalances = () => {
  const transactions = getAllTransactions()
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

export const getWallets = () =>
  Object.keys(state.get('wallets'))
    .map(walletId => {
      const wallet = state.wallets[walletId]
      const balances = getBalancesForWallet(walletId)
      return {
        ...wallet,
        id: walletId,
        balances: balances || { [wallet.symbol]: 0 }
      }
    })

export const getLedgerWallets = () =>
  getWallets()
    .filter(wallet => wallet.isLedgerWallet)

export const getTrezorWallets = () =>
  getWallets()
    .filter(wallet => wallet.isTrezorWallet)
