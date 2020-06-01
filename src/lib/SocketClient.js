import io from 'socket.io-client'
import * as config from '../config'
import { assetService } from '../services'
import { updateSecurity } from '../ventiStore/securities'
import * as schema from '../ventiStore/schema'
import { normalize } from 'normalizr'
import _ from 'lodash'
import { state } from 'venti'

export default class SocketClient {
  constructor() {
    this.subscriptionCounts = {}
    this.subscriptionQueue = []
    this.unsubscriptionQueue = []
    this.subscribed = []

    this.syncSubscriptions = _.debounce(this.syncSubscriptions, 3000, { maxWait: 30000 })
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

    this.socket.on('security', this.onSecurity)
  }

  onSecurity(security) {
    const baseCurrency = state.get('user.baseCurrency', '')
    if (security.baseCurrency !== baseCurrency) return
    security.lastUpdated = new Date()
    // update venti state
    const { symbol } = security
    assetService.update(symbol, security)
    const normalizedSecurity = normalize(security, schema.security)
    updateSecurity(normalizedSecurity)
  }

  subscribe(symbol) {
    this.unsubscriptionQueue = _.without(this.unsubscriptionQueue, symbol)
    this.subscriptionQueue = _.union(this.subscriptionQueue, [symbol])
    this.syncSubscriptions()
    this.subscriptionCounts[symbol] = this.subscriptionCounts[symbol] ? this.subscriptionCounts[symbol] + 1 : 1

    return () => {
      this.subscriptionCounts[symbol]--
      if (this.subscriptionCounts[symbol] === 0) {
        this.subscriptionQueue = _.without(this.subscriptionQueue, symbol)
        this.unsubscriptionQueue = _.union(this.unsubscriptionQueue, [symbol])
        this.syncSubscriptions()
      }
    }
  }

  subscribeAll(symbols) {
    const unsubs = symbols.map(this.subscribe, this)
    return () => {
      unsubs.forEach(unsub => unsub())
    }
  }

  syncSubscriptions() {
    if (!this.socketReady) {
      return setTimeout(() => this.syncSubscriptions(), 1000)
    }

    const currentBaseCurrency = state.get('user.baseCurrency', '')

    if (currentBaseCurrency !== this.subscribedBaseCurrency) {
      let previouslySubscribed = this.subscribed.slice()
      if (this.subscribed.length !== 0) {
        this.leaveAll()
      }

      const toResubscribe = _.without(previouslySubscribed, ...this.unsubscriptionQueue)
      toResubscribe.forEach(_.partial(this.join, currentBaseCurrency))
      this.subscriptionQueue.forEach(_.partial(this.join, currentBaseCurrency))
      this.subscribedBaseCurrency = currentBaseCurrency
    } else {
      const toLeave = _.intersection(this.subscribed, this.unsubscriptionQueue)
      const toJoin = _.without(this.subscriptionQueue, ...this.subscribed)

      toLeave.forEach(_.partial(this.leave, currentBaseCurrency))
      toJoin.forEach(_.partial(this.join, currentBaseCurrency))
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
