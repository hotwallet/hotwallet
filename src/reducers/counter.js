import { COUNTER_INCREMENT, COUNTER_DECREMENT, COUNTER_SET_SIZE } from '../actions/types'

const initialState = {
  count: 0,
  size: 1
}

export const getCounter = function (state) {
  return state.count
}

export default (state = initialState, action) => {
  switch (action.type) {
    case COUNTER_INCREMENT:
      return { ...state, count: state.count + state.size }
    case COUNTER_DECREMENT:
      return { ...state, count: state.count - state.size }
    case COUNTER_SET_SIZE:
      return { ...state, size: Number(action.size) }
    default:
      return state
  }
}
