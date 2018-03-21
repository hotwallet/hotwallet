export const COUNTER_INCREMENT = 'COUNTER_INCREMENT'
export const COUNTER_DECREMENT = 'COUNTER_DECREMENT'
export const COUNTER_SET_SIZE = 'COUNTER_SET_SIZE'

export const incrementCounter = () => ({ type: COUNTER_INCREMENT })
export const decrementCounter = () => ({ type: COUNTER_DECREMENT })
export const setCounterSize = (size) => ({ type: COUNTER_SET_SIZE, size })
