import { getBalanceForSymbol } from './transactions'

import { state } from 'venti'

export const rowsPerPage = 75

export const getSecuritiesBySymbol = () => state.get('securities.bySymbol', {})

export const getSecurities = () => Object.values(getSecuritiesBySymbol())

export const getBalancesOnlyFilter = () => state.get('securities.metadata.balancesOnly')
export const getQuery = () => state.get('ephemeral.filterSymbolsQuery')

export const getSecurity = symbol => state.get(`securities.bySymbol.${symbol}`)

export const getStateSlices = () => ({
  securities: state.get('securities'),
  transactions: state.get('transactions'),
  ephemeral: {
    rowSlice: state.get('ephemeral.rowSlice')
  }
})

const getRank = (symbol, rank) => rank

export const getDecoratedSecurity = (symbol, r) => {
  const security = getSecurity(symbol)
  const balance = getBalanceForSymbol(symbol)
  const rank = getRank(symbol, r)
  return {
    ...security,
    balance,
    rank
  }
}

export const getVisibleSecurities = () => {
  const curStateSlice = getStateSlices()
  const securities = getSecurities()
  const isHidingEmptyBalances = getBalancesOnlyFilter()
  const query = getQuery()
  const [first, last] = state.get('ephemeral.rowSlice', [])
  const byMktCap = (a, b) => (a.marketCap > b.marketCap) ? -1 : 1
  const sortedSecurities = securities.slice().sort(byMktCap)
  return sortedSecurities
    .map((security, i) => {
      // decorated security is cached for each symbol
      const symbol = security.symbol
      const rank = i + 1
      return getDecoratedSecurity(symbol, rank)
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
