import { v4 } from 'uuid'

const id = v4()

const ephemeralState = {
  app: undefined
}

// always become primary on load
window.localStorage.setItem('primary', id)

window.onfocus = () => {
  if (window.localStorage.getItem('primary') !== id) {
    window.location.reload()
  }
}

export const loadState = () => {
  try {
    const serializedState = window.localStorage.getItem('state')
    if (serializedState === null) {
      return undefined
    }
    const state = JSON.parse(serializedState)
    delete state.apps
    return state
  } catch (err) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    if (window.localStorage.primary === id) {
      const serializedState = JSON.stringify({ ...state, ...ephemeralState })
      window.localStorage.setItem('state', serializedState)
    }
  } catch (err) {
    // ignore write errors
  }
}
