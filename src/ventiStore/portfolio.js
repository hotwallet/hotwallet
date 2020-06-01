import moment from 'moment'
import _get from 'lodash/get'
import debounce from 'lodash/debounce'
import { getDailyBalances } from '../ventiSelectors/transactions'
import client from '../lib/hotwalletClient'
import { setPrices } from './prices'
import { state } from 'venti'

export const getPriceKey = ({ symbol, baseCurrency, date }) => {
  const pair = `${symbol}${baseCurrency}`
  const numericDate = date.split('-').join('')
  return `${pair}${numericDate}`
}

export const setChartData = chartData => {
  state.set('portfolio.chartData', chartData)
  state.set('portfolio.lastRefresh', Date.now())
}

export const setDateRange = range => {
  state.set('portfolio.range', range)
  refreshChart()
}

const runRefreshChart = () => {
  const baseCurrency = state.get('user.baseCurrency', '')

  // get the daily balances for date range
  const dailyBalances = getDailyBalances()
  const firstTransactionDate = Object.keys(dailyBalances)[0]
  const symbols = Object.keys(dailyBalances[firstTransactionDate] || {})

  // ensure we have prices for symbols for this date range
  const [qty, unit] = state.get('portfolio.range.label', '').split(' ')
  const start = moment().subtract(qty, unit)
  const chartDates = []
  const prices = state.get('prices', {})
  const existingPrices = prices
  const DATE_FORMAT = 'YYYY-MM-DD'
  const pricesQuery = { baseCurrency, symbols: [] }
  for (let m = moment(start); m.format(DATE_FORMAT) <= moment().format(DATE_FORMAT); m.add(1, 'days')) {
    const date = m.format(DATE_FORMAT)
    chartDates.push(date)
    symbols.forEach(symbol => {
      const priceKey = getPriceKey({ symbol, baseCurrency, date })
      if (existingPrices[priceKey] === undefined) {
        if (!pricesQuery.startDate) pricesQuery.startDate = date
        if (!pricesQuery.symbols.includes(symbol)) pricesQuery.symbols.push(symbol)
        pricesQuery.endDate = date
      }
    })
  }
  Promise.resolve()
    // get the missing price data
    .then(() => {
      if (!pricesQuery.symbols.length) return
      pricesQuery.symbols = pricesQuery.symbols.join(',')
      return client.get('/prices', pricesQuery)
        .then(prices => (setPrices(prices)))
    })
    // format chart data
    .then(() => {
      const prices = state.get('prices', {})
      const chartData = []
      chartDates.forEach(date => {
        const totalValue = symbols.reduce((total, symbol) => {
          const priceKey = getPriceKey({ symbol, baseCurrency, date })
          if (!prices[priceKey]) {
            return total
          }
          return total + (_get(dailyBalances, [date, symbol], 0) * prices[priceKey])
        }, 0)
        chartData.push([
          Number(moment(date).format('x')),
          totalValue
        ])
      })
      setChartData(chartData)
    })
}

const refreshChartDebounced = debounce(runRefreshChart, 1000)

export const refreshChart = () => refreshChartDebounced()
