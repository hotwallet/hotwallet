const initialState = {
  count: 0,
  size: 1
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'counter.increment':
      return { ...state, count: state.count + state.size }
    case 'counter.decrement':
      return { ...state, count: state.count - state.size }
    case 'counter.setSize':
      return { ...state, size: Number(action.size) }
    default:
      return state
  }
}
