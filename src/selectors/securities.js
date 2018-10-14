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
export const getQuery = state => state.ephemeral.filterSymbolsQuery

export const getSecurity = (state, symbol) => {
  return state.securities.bySymbol[symbol]
}

export const getStateSlices = createStructuredSelector({
  securities: state => state.securities,
  transactions: state => state.transactions,
  ephemeral: createStructuredSelector({
    rowSlice: state => state.ephemeral.rowSlice
  })
})

const getRank = (state, symbol, rank) => rank

export const getDecoratedSecurity = createCachedSelector(
  getSecurity,
  getBalanceForSymbol,
  getRank,
  (security, balance, rank) => ({ ...security, balance, rank })
)(
  (state, symbol, rank) => `${symbol}:${rank}`
)

export const getVisibleSecurities = createSelector(
  [getStateSlices, getSecurities, getBalancesOnlyFilter, getQuery],
  (state, securities, isHidingEmptyBalances, query) => {
    const [first, last] = state.ephemeral.rowSlice
    const byMktCap = (a, b) => (a.marketCap > b.marketCap) ? -1 : 1
    const sortedSecurities = securities.slice().sort(byMktCap)
    return sortedSecurities
      .map((security, i) => {
        // decorated security is cached for each symbol
        const symbol = security.symbol
        const rank = i + 1
        return getDecoratedSecurity(state, symbol, rank)
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
