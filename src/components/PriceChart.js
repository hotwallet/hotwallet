import React from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts/ReactHighstock'
import Highcharts from 'highcharts'
// import DateRangeSelector from './DateRangeSelector'
import { Loader } from 'semantic-ui-react'
import { lightBlue, darkBlue, darkBg, desktopPadding, mobilePadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import { getSymbolsWithTransactions } from '../selectors/transactions'
import { subscribeSymbols } from '../lib/subscribe'

Highcharts.setOptions({
  global: { useUTC: false }
})

const gridLineColor = '#323a42'
const gridLineWidth = 2
const lineColor = 'red'
const color = 'red'
const lineWidth = 1.5
const fiveMinutes = 1000 * 60 * 5
const upColor = 'green'

class PriceChart extends React.PureComponent {
  componentDidMount() {
    const { lastRefresh, chartData, symbol } = this.props
    this.props.getOHLC(symbol)
    const age = Date.now() - lastRefresh
    const isStale = (age > fiveMinutes)
    if (!chartData || !chartData.length || isStale) {
      this.props.refreshChart()
    }
  }

  render() {
    const { lastRefresh, ohlc, isMobile, isTablet } = this.props
    const chartData = ohlc.map(entry => {
      return [
        (new Date(entry.date)).getTime(), // date
        entry.open, // open
        entry.high, // high
        entry.low, // low
        entry.close // close
      ]
    })
    const age = Date.now() - lastRefresh
    const isStale = (age > fiveMinutes)
    const data = isStale ? [] : chartData
    const chartConfig = {
      chart: {
        // zoomType: 'x',
        backgroundColor: null,
        plotBackgroundColor: darkBg,
        spacing: isMobile ? mobilePadding : [
          desktopPadding,
          isTablet ? desktopPadding : 0,
          desktopPadding,
          desktopPadding
        ],
        height: isMobile ? 200 : 400
      },
      title: {
        text: null
      },
      xAxis: {
        type: 'datetime',
        lineWidth: 0,
        gridLineWidth,
        gridLineColor,
        minPadding: 0,
        maxPadding: 0,
        tickLength: 0
      },
      yAxis: {
        title: false,
        lineWidth: 0,
        gridLineWidth,
        gridLineColor,
        floor: 0
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        candlestick: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.Color(lightBlue).setOpacity(0.75).get('rgba')],
              [1, Highcharts.Color(darkBlue).setOpacity(0.75).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth,
          lineColor,
          upLineColor: upColor,
          upColor,
          color,
          states: {
            hover: {
              lineWidth
            }
          },
          threshold: null
        }
      },
      series: [{
        type: 'candlestick',
        name: 'Price history',
        data
      }]
    }
    return (
      <div style={{ position: 'relative' }}>
        {isStale ? <Loader active /> : ''}
        {/*
        <DateRangeSelector
          baseCurrency={this.props.baseCurrency}
          deviceType={this.props.deviceType}
        setDateRange={this.props.setDateRange} />
        */}
        <ReactHighcharts config={chartConfig} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.ephemeral.isMobile,
  deviceType: state.ephemeral.deviceType,
  isTablet: state.ephemeral.isTablet,
  ohlc: state.ohlc,
  lastRefresh: state.portfolio.lastRefresh,
  hasNoTransactions: !Object.keys(state.transactions.byId).length,
  baseCurrency: state.user.baseCurrency,
  symbols: getSymbolsWithTransactions(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(subscribeSymbols(PriceChart))
