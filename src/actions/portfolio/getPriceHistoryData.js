import client from '../../lib/tarragonClient'
import moment from 'moment'
import set from 'lodash/set'
import find from 'lodash/find'
import { UPDATE_PRICE_HISTORY_DATA } from './index'

// TODO: this needs to be refactored/optimized
const getPriceHistoryData = () => (dispatch, getState) => {
  const state = getState()
  const baseCurrency = state.user.baseCurrency
  const { startDate, endDate } = state.portfolio.range
  const DATE_FORMAT = 'YYYY-MM-DD'
  const balances = {}
  const symbols = []
  state.transactions.forEach(transaction => {
    const date = moment(transaction.txTime).format(DATE_FORMAT)
    const symbol = transaction.symbol
    const walletId = transaction.walletId
    if (!symbols.includes(symbol)) {
      symbols.push(symbol)
    }
    set(balances, [symbol, date, walletId], Number(transaction.balance))
  })
  const query = {
    baseCurrency,
    startDate,
    endDate,
    symbols: symbols.join(',')
  }
  client.get('/prices', query)
    .then(prices => {
      const values = []
      const start = moment(startDate)
      const end = moment(endDate).add(1, 'days')
      for (let m = moment(start); m.isBefore(end); m.add(1, 'days')) {
        const date = m.format(DATE_FORMAT)
        let total = 0
        const data = {
          date,
          assets: symbols.map(symbol => {
            const row = find(prices, { symbol, date }) || { price: 0 }
            const price = Number(row.price)
            const quantity = getBalance(balances, symbol, date)
            const value = quantity * price
            total += value
            return { symbol, price, quantity, value, baseCurrency }
          })
        }
        data.total = total
        data.baseCurrency = baseCurrency
        values.push(data)
      }
      const priceHistoryData = values.map(value => {
        const totalValue = value.assets.reduce((total, asset) => total + asset.value, 0)
        return [
          Number(moment(value.date).format('x')),
          totalValue
        ]
      })
      dispatch({
        type: UPDATE_PRICE_HISTORY_DATA,
        priceHistoryData
      })
    })
}

function getBalance(balances, symbol, targetDate) {
  let runningBalances = {}
  Object.keys(balances[symbol]).some(date => {
    if (date > targetDate) return true
    if (balances[symbol][date]) {
      Object.keys(balances[symbol][date]).forEach(walletId => {
        runningBalances[walletId] = balances[symbol][date][walletId]
      })
    }
    return false
  })
  return Object.keys(runningBalances).reduce((total, walletId) => {
    return total + runningBalances[walletId]
  }, 0)
}

export default getPriceHistoryData
