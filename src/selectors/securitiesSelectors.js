import { createSelector, createStructuredSelector } from 'reselect'
import { getBalanceForSymbol } from './transactionSelectors'
import createCachedSelector from 're-reselect'

export const getSecurities = state => Object.values(state.securities.bySymbol)
export const getBalancesOnlyFilter = state => state.securities.metadata.balancesOnly
export const getQuery = state => state.app.filterSymbolsQuery

export const getSecurity = (state, symbol) => {
  return getSecurities(state).find(s => s.symbol === symbol)
}

export const getStateSlices = createStructuredSelector({
  securities: state => state.securities,
  transactions: state => state.transactions
})

export const getVisibleSecurities = createSelector(
  [getStateSlices, getSecurities, getBalancesOnlyFilter, getQuery],
  (state, securities, isHidingEmptyBalances, query) => {
    return securities && securities.slice(0, 100)
      // getSecurityWithBalance is cached for each symbol
      .map(security => getSecurityWithBalance(state, security.symbol))
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

// export const getCachedVisibleSecurities = createCachedSelector(
//   getSecurities,
//   getBalancesOnlyFilter,
//   getQuery,
//   (state, someArg) => someArg,
//   (securities, isHidingEmptyBalances, query, someArg) => {
//     return securities && securities.slice(0, 100)
//       .map(security => ({
//         ...security,
//         balance: getBalance(state, security.symbol)
//       }))
//       // toggle hiding empty balances
//       .filter(security => {
//         if (!isHidingEmptyBalances || query) return true
//         return (security.balance || security.balance === 0)
//       })
//       // search query
//       .filter(security => {
//         if (!query) return true
//         const lowerCaseQuery = query.toLowerCase()
//         return security.symbol.includes(query.toUpperCase()) ||
//           security.name.toLowerCase().includes(lowerCaseQuery)
//       })
//   }
// )(
//   (state, someArg) => someArg
// )

export const getSecurityWithBalance = createCachedSelector(
  [getSecurity, getBalanceForSymbol],
  (security, balance) => ({...security, balance})
)(
  (state, symbol) => symbol
)
