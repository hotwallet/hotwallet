import io from 'socket.io-client'
import * as config from '../config'
import store from '../store'
import { updateSecurity } from '../actions/securities'
import * as schema from '../actions/schema'
import { normalize } from 'normalizr'
import _ from 'lodash'

export default class SocketClient {
  constructor() {
    this.subscriptionQueue = []
    this.unsubscriptionQueue = []
    this.subscribed = []

    this.syncSubscriptions = _.throttle(this.syncSubscriptions, 1000)
    this.socketReady = false
    this.join = this.join.bind(this)
    this.leave = this.leave.bind(this)
    this.leaveAll = this.leaveAll.bind(this)
  }

  start() {
    this.socket = io(config.serverUrl)
    this.socket.on('connect', () => {
      this.socketReady = true
      this.syncSubscriptions()
    })

    this.socket.on('security', this.dispatchSecurity)
  }

  dispatchSecurity(security) {
    const state = store.getState()
    const baseCurrency = state.user.baseCurrency
    if (security.baseCurrency === baseCurrency) {
      const normalizedSecurity = normalize(security, schema.security)
      store.dispatch(updateSecurity(normalizedSecurity))
    }
  }

  subscribe(symbol) {
    this.unsubscriptionQueue = _.without(this.unsubscriptionQueue, symbol)
    this.subscriptionQueue.push(symbol)
    this.syncSubscriptions()
  }

  subscribeAll(symbols) {
    symbols.forEach(this.subscribe, this)
  }

  unsubscribe(symbol) {
    this.subscriptionQueue = _.without(this.subscriptionQueue, symbol)
    this.unsubscriptionQueue.push(symbol)
    this.syncSubscriptions()
  }

  unsubscribeAll() {
    this.subscriptionQueue = []
    this.unsubscriptionQueue = this.subscribed.slice()
    this.syncSubscriptions()
  }

  syncSubscriptions() {
    if (!this.socketReady) {
      return setTimeout(() => this.syncSubscriptions(), 1000)
    }

    const currentBaseCurrency = store.getState().user.baseCurrency

    if (currentBaseCurrency !== this.subscribedBaseCurrency) {
      if (this.subscribed.length !== 0) {
        this.leaveAll()
      }

      this.subscriptionQueue.forEach(_.partial(this.join, currentBaseCurrency))
      this.subscribedBaseCurrency = currentBaseCurrency
    } else {
      const toLeave = _.intersection(this.subscribed, this.unsubscriptionQueue)
      const toJoin = _.without(this.subscriptionQueue, ...this.subscribed)

      toJoin.forEach(_.partial(this.join, currentBaseCurrency))
      toLeave.forEach(_.partial(this.leave, currentBaseCurrency))
    }

    this.unsubscriptionQueue = []
    this.subscriptionQueue = []
  }

  join(currency, symbol) {
    this.socket.emit('join', `securities:${symbol}:${currency}`)
    this.subscribed.push(symbol)
  }

  leave(currency, symbol) {
    this.socket.emit('leave', `securities:${symbol}:${currency}`)
    this.subscribed = _.without(this.subscribed, symbol)
  }

  leaveAll() {
    this.subscribed.forEach((symbol) => {
      this.socket.emit('leave', `securities:${symbol}:${this.subscribedBaseCurrency}`)
    })
    this.subscribed = []
  }
}
