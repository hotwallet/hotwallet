import { PORTFOLIO_SET_DATE_RANGE } from '../actions/portfolio'

const initialState = {
  range: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case PORTFOLIO_SET_DATE_RANGE:
      return { ...state, range: action.range }
    default:
      return state
  }
}
