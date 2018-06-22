import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'
import client from './lib/tarragonClient'
import { getSymbolsWithTransactions } from './selectors/transactionSelectors'

export const history = createHistory()

const persistedState = loadState()
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
  saveState(store.getState())
}, 1000))

// Initial subscription for symbols with transactions
client.socket.subscribeAll(getSymbolsWithTransactions(store.getState()))

export default store
