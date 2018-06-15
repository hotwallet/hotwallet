import moment from 'moment'
import _get from 'lodash/get'
import { getDailyBalances } from '../selectors/transactionSelectors'
import client from '../lib/tarragonClient'
import { setPrices } from './prices'

export const PORTFOLIO_SET_DATE_RANGE = 'PORTFOLIO_SET_DATE_RANGE'
export const SET_CHART_DATA = 'SET_CHART_DATA'

export const getPriceKey = ({ symbol, baseCurrency, date }) => {
  const pair = `${symbol}${baseCurrency}`
  const numericDate = date.split('-').join('')
  return `${pair}${numericDate}`
}

export const setChartData = chartData => ({ type: SET_CHART_DATA, chartData })

export const setDateRange = range => (dispatch, getState) => {
  dispatch({
    type: PORTFOLIO_SET_DATE_RANGE,
    range
  })
  refreshChart()(dispatch, getState)
}

export const refreshChart = () => (dispatch, getState) => {
  const state = getState()
  const baseCurrency = state.user.baseCurrency

  // get the daily balances for date range
  const dailyBalances = getDailyBalances(state)
  const firstTransactionDate = Object.keys(dailyBalances)[0]
  const symbols = Object.keys(dailyBalances[firstTransactionDate]) || []

  // ensure we have prices for symbols for this date range
  const [qty, unit] = state.portfolio.range.label.split(' ')
  const start = moment().subtract(qty, unit)
  const chartDates = []
  const existingPrices = getState().prices
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
        .then(prices => dispatch(setPrices(prices)))
    })
    // format chart data
    .then(() => {
      const prices = getState().prices
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
      dispatch(setChartData(chartData))
    })
}
