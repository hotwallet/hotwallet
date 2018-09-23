import {
  SET_SYMMETRIC_KEY,
  SET_ASYMMETRIC_KEY
} from '../actions/sync'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SYMMETRIC_KEY:
      return { ...state, symmetricKey: action.key }
    case SET_ASYMMETRIC_KEY:
      return { ...state, asymmetricKey: action.key }
    default:
      return state
  }
}
