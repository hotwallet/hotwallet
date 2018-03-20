import { PORTFOLIO_SET_DATE_RANGE } from '../actions/portfolio'

const initialState = {
  startDate: null,
  endDate: null,
  granularity: null
}

export const getPortfolioState = state => state.portfolio

export default (state = initialState, action) => {
  switch (action.type) {
    case PORTFOLIO_SET_DATE_RANGE:
      return Object.assign({}, state, action)
    default:
      return state
  }
}
