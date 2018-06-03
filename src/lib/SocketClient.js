import io from 'socket.io-client'
import * as config from '../config'
import store from '../store'
import { updateSecurity } from '../actions/securities'
import * as schema from '../actions/schema'
import { normalize } from 'normalizr'

export default class SocketClient {
  start() {
    this.socket = io(config.serverUrl)
    this.socket.on('connect', () => {
      this.subscribeToPriceUpdates()
    })
    this.socket.on('security', security => {
      const state = store.getState()
      const baseCurrency = state.user.baseCurrency
      // console.log(security.symbol, security.baseCurrency, security.price)
      if (security.baseCurrency === baseCurrency) {
        const normalizedSecurity = normalize(security, schema.security)
        store.dispatch(updateSecurity(normalizedSecurity))
      }
    })
  }

  subscribeToPriceUpdates() {
    const state = store.getState()
    const baseCurrency = state.user.baseCurrency
    // wait until we have securities to subscribe to
    // TODO: this may change over time, so subscribing just at the start is inadequate
    if (!state.securities.allSymbols || state.securities.allSymbols.length === 0) {
      return setTimeout(() => this.subscribeToPriceUpdates(), 1000)
    }
    const activeSymbols = state.securities.allSymbols.slice(0, 100)
    activeSymbols.forEach(symbol => {
      const room = `securities:${symbol}:${baseCurrency}`
      this.socket.emit('join', room)
    })
  }
}
