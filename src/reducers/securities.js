const initialState = {}

export const getSecurities = function (state) {
  return state.securities
}

export const getIsFetching = function (state) {
  return state.isFetching
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'securities.fetch':
      return { ...state, isFetching: true }
    case 'securities.fetchSuccess':
      return { securities: action.response, isFetching: false }
    case 'securities.fetchFailure':
      return { ...state, isFetching: false, failureMessage: action.message }
    default:
      return state
  }
}
