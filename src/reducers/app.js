import { SET_DEVICE } from '../actions/app'

const initialState = {
  device: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_DEVICE:
      return { ...state, device: { ...action.device } }
    default:
      return {
        device: {},
        ...state
      }
  }
}
