import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import localStorage from './localStorage'
import indexedDB from './indexedDB'
import throttle from 'lodash/throttle'

let storeInstance

const createLocalStore = async () => {
  let persistor = indexedDB.isSupported() ? indexedDB : localStorage

  const persistedState = await persistor.loadState()

  const enhancers = []
  const middleware = [routerMiddleware(history), thunk]

  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers)
  const store = createStore(rootReducer, persistedState, composedEnhancers)

  store.subscribe(throttle(() => {
    persistor.saveState(store.getState())
  }, 1000))

  storeInstance = store

  return store
}

export const history = createHistory()

// returns undefined if store not yet set
export const getStoreSync = () => {
  return storeInstance
}

export const getStoreAsync = async () => {
  if (storeInstance) {
    return storeInstance
  }
  return createLocalStore()
}
