import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'

export const getState = state => state
export const getSecurities = state => state.securities.securities
export const getBalancesOnlyFilter = state => state.securities.balancesOnly
export const getQuery = state => state.app.filterSymbolsQuery

export const getTransactionsForSymbol = (state, symbol) => {
  return state.transactions.filter(t => t.symbol === symbol)
}

export const getSecurity = (state, symbol) => {
  return getSecurities(state).find(s => s.symbol === symbol)
}

export const getVisibleSecurities = createSelector(
  [getState, getSecurities, getBalancesOnlyFilter, getQuery],
  (state, securities, isHidingEmptyBalances, query) => {
    return securities && securities.slice(0, 100)
      .map(security => ({
        ...security,
        balance: getBalance(state, security.symbol)
      }))
      // toggle hiding empty balances
      .filter(security => {
        if (!isHidingEmptyBalances || query) return true
        return (security.balance || security.balance === 0)
      })
      // search query
      .filter(security => {
        if (!query) return true
        const lowerCaseQuery = query.toLowerCase()
        return security.symbol.includes(query.toUpperCase()) ||
          security.name.toLowerCase().includes(lowerCaseQuery)
      })
  }
)

export const getCachedVisibleSecurities = createCachedSelector(
  getSecurities,
  getBalancesOnlyFilter,
  getQuery,
  (state, someArg) => someArg,
  (securities, isHidingEmptyBalances, query, someArg) => {
    return securities && securities.slice(0, 100)
      .map(security => ({
        ...security,
        balance: getBalance(state, security.symbol)
      }))
      // toggle hiding empty balances
      .filter(security => {
        if (!isHidingEmptyBalances || query) return true
        return (security.balance || security.balance === 0)
      })
      // search query
      .filter(security => {
        if (!query) return true
        const lowerCaseQuery = query.toLowerCase()
        return security.symbol.includes(query.toUpperCase()) ||
          security.name.toLowerCase().includes(lowerCaseQuery)
      })
  }
)(
  (state, someArg) => someArg
)

export const getBalance = createCachedSelector(
  [getSecurity, getTransactionsForSymbol],
  (security, transactions) => {
    const balancesByWalletId = {}
    transactions.forEach(tx => {
      if (balancesByWalletId[tx.walletId] !== undefined) return
      balancesByWalletId[tx.walletId] = tx.balance
    })
    let balance
    Object.keys(balancesByWalletId).forEach(walletId => {
      if (!balance) balance = 0
      balance += balancesByWalletId[walletId]
    })
    return balance
  }
)(
  (state, symbol) => symbol
)
