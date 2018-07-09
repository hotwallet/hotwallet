import { createSelector, createStructuredSelector } from 'reselect'
import { getBalanceForSymbol } from './transactions'
import createCachedSelector from 're-reselect'

export const rowsPerPage = 75

export const getSecuritiesBySymbol = state => state.securities.bySymbol

export const getSecurities = createSelector(
  getSecuritiesBySymbol,
  securitiesBySymbol => Object.values(securitiesBySymbol)
)

export const getBalancesOnlyFilter = state => state.securities.metadata.balancesOnly
export const getQuery = state => state.app.filterSymbolsQuery

export const getSecurity = (state, symbol) => {
  return state.securities.bySymbol[symbol]
}

export const getStateSlices = createStructuredSelector({
  securities: state => state.securities,
  transactions: state => state.transactions,
  app: createStructuredSelector({
    rowSlice: state => state.app.rowSlice
  })
})

export const getVisibleSecurities = createSelector(
  [getStateSlices, getSecurities, getBalancesOnlyFilter, getQuery],
  (state, securities, isHidingEmptyBalances, query) => {
    const [first, last] = state.app.rowSlice
    const byMktCap = (a, b) => (a.marketCap > b.marketCap) ? -1 : 1
    const sortedSecurities = securities.slice().sort(byMktCap)
    return sortedSecurities
      .map((security, i) => {
        // getSecurityWithBalance is cached for each symbol
        const securityWithBalance = getSecurityWithBalance(state, security.symbol)
        return { ...securityWithBalance, rank: i + 1 }
      })
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
      .slice(first, last + 1)
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
