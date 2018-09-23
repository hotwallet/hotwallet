import {
  SET_LEDGER_DATA
} from '../actions/ledger'

const initialState = {
  data: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LEDGER_DATA:
      return { ...state, data: action.data }
    default:
      return state
  }
}
