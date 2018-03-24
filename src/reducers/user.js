import { SET_BASE_CURRENCY } from '../actions/user'

const initialState = {
  baseCurrency: 'USD'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BASE_CURRENCY:
      return {
        ...state,
        baseCurrency: action.currency
      }
    default:
      return state
  }
}
