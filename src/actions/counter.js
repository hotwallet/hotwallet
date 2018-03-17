import { COUNTER_INCREMENT, COUNTER_DECREMENT, COUNTER_SET_SIZE } from './types'

export const incrementCounter = () => ({ type: COUNTER_INCREMENT })
export const decrementCounter = () => ({ type: COUNTER_DECREMENT })
export const setCounterSize = (size) => ({ type: COUNTER_SET_SIZE, size })
