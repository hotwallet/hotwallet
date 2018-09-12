import {
  SET_LEDGER_STATUS
} from '../actions/ledger'

const initialState = {
  status: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LEDGER_STATUS:
      return { ...state, status: action.status }
    default:
      return state
  }
}
