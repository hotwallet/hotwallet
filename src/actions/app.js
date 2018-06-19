import { rowsPerPage } from '../selectors/securitiesSelectors'

export const SET_DEVICE = 'SET_DEVICE'
export const FILTER_SYMBOLS = 'FILTER_SYMBOLS'
export const SET_ROW_SLICE = 'SET_ROW_SLICE'

export const setDevice = (device) => ({ type: SET_DEVICE, device })

export const filterSymbols = query => ({
  type: FILTER_SYMBOLS,
  query
})

export const setLastVisibleRow = rowIndex => (dispatch, getState) => {
  const currentLast = getState().app.rowSlice[1]
  const target = rowIndex + (2 * rowsPerPage)
  if (target > currentLast) {
    dispatch({ type: SET_ROW_SLICE, rowSlice: [0, target] })
  }
}
