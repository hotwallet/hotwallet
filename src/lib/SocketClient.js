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
      store.dispatch(updateSecurity(security))
    })
  }

  subscribeToPriceUpdates() {
    const state = store.getState()
    const baseCurrency = state.user.baseCurrency
    const visibleSecurities = state.securities.securities.slice(0, 100)
    visibleSecurities.forEach(security => {
      const room = `securities:${security.symbol}:${baseCurrency}`
      this.socket.emit('join', room)
    })
  }
}
