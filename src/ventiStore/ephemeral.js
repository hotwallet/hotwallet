import { state } from 'venti'

import { rowsPerPage } from '../ventiSelectors/securities'

export const setDevice = (device) => state.set('ephemeral.device', device)

export const filterSymbols = query => state.set('ephemeral.filterSymbolsQuery', query)

export const setLastVisibleRow = rowIndex => {
  const currentLast = state.get('app.rowSlice', [])[1]
  const target = rowIndex + (2 * rowsPerPage)
  if (target > currentLast) {
    const rowSlice = [0, target]
    const [first, last] = rowSlice || []
    const [newFirst, newLast] = rowSlice
    if (first === newFirst && last === newLast) {
      return
    }
    state.set('ephemeral.rowSlice', rowSlice)
  }
}
