import getPriceData from './getPriceHistoryData'

export const PORTFOLIO_SET_DATE_RANGE = 'PORTFOLIO_SET_DATE_RANGE'
export const UPDATE_PRICE_HISTORY_DATA = 'GET_PRICE_HISTORY_DATA'

export const getPriceHistoryData = getPriceData

export const setDateRange = range => (dispatch, getState) => {
  dispatch({
    type: PORTFOLIO_SET_DATE_RANGE,
    range
  })
  getPriceHistoryData()(dispatch, getState)
}

