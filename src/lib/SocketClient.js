import io from 'socket.io-client'
import * as config from '../config'
import store from '../store'
import { updateSecurity } from '../actions/securities'

export default class SocketClient {
  start() {
    this.socket = io(config.serverUrl)
    this.socket.on('connect', () => {
      this.subscribeToPriceUpdates()
    })
    this.socket.on('security', security => {
      const state = store.getState()
      const baseCurrency = state.user.baseCurrency
      console.log(security.symbol, security.baseCurrency, security.price)
      if (security.symbol === baseCurrency) {
        store.dispatch(updateSecurity(security))
      }
    })
  }

  subscribeToPriceUpdates() {
    const state = store.getState()
    const baseCurrency = state.user.baseCurrency
    // wait until we have securities to subscribe to
    if (!state.securities.securities) {
      return setTimeout(() => this.subscribeToPriceUpdates(), 1000)
    }
    const activeSecurities = state.securities.securities.slice(0, 100)
    activeSecurities.forEach(security => {
      const room = `securities:${security.symbol}:${baseCurrency}`
      this.socket.emit('join', room)
    })
  }
}
