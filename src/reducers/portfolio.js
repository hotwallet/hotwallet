import {
  PORTFOLIO_SET_DATE_RANGE,
  SET_CHART_DATA
} from '../actions/portfolio'

import { dateRanges } from '../components/DateRangeSelector'

const initialState = {
  range: dateRanges.find(dateRange => !!dateRange.isDefault),
  chartData: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PORTFOLIO_SET_DATE_RANGE:
      return { ...state, range: action.range }
    case SET_CHART_DATA:
      return {
        ...state,
        chartData: action.chartData,
        lastRefresh: Date.now()
      }
    default:
      return state
  }
}
