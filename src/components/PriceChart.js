import React from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts/ReactHighstock'
import Highcharts from 'highcharts'
import { lightBlue, darkBlue, darkBg, desktopPadding, mobilePadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import { getSymbolsWithTransactions } from '../selectors/transactions'
import { subscribeSymbols } from '../lib/subscribe'

Highcharts.setOptions({
  global: { useUTC: false }
})

const gridLineColor = '#323a42'
const gridLineWidth = 1
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
    const { ohlc, isMobile, isTablet } = this.props
    const ohlcData = ohlc.map(entry => {
      return [
        (new Date(entry.date)).getTime(),
        entry.open,
        entry.high,
        entry.low,
        entry.close
      ]
    })
    const volumeData = ohlc.map(entry => {
      return [
        (new Date(entry.date)).getTime(),
        Math.floor(entry.volume)
      ]
    })
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
      yAxis: [
        {
          title: false,
          lineWidth: 0,
          gridLineWidth,
          gridLineColor,
          floor: 0,
          height: '80%'
        },
        {
          title: false,
          gridLineWidth: 0,
          height: '20%',
          top: '80%',
          labels: { enabled: false }
        }
      ],
      legend: {
        enabled: false
      },
      rangeSelector: {
        enabled: false
      },
      scrollbar: {
        enabled: false
      },
      navigator: {
        outlineColor: '#ccc',
        maskFill: 'rgba(90,90,90,0.4)',
        margin: 10
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
      series: [
        {
          type: 'column',
          name: 'Volume',
          data: volumeData,
          yAxis: 1,
          color: '#888'
        },
        {
          type: 'candlestick',
          name: 'Price history',
          data: ohlcData,
          yAxis: 0
        }
      ]
    }
    return (
      <div style={{ position: 'relative' }}>
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
