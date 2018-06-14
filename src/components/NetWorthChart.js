import React from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import DateRangeSelector from './DateRangeSelector'
import { lightBlue, darkBlue, darkBg, desktopPadding, mobilePadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'

Highcharts.setOptions({
  global: { useUTC: false }
})

const gridLineColor = '#323a42'
const gridLineWidth = 2
const lineColor = lightBlue
const lineWidth = 1.5

class NetWorthChart extends React.Component {
  componentDidMount() {
    if (!this.props.chartData.length) {
      this.props.refreshChart()
    }
  }

  render() {
    const isMobile = this.props.isMobile
    const isTablet = this.props.isTablet
    const data = this.props.chartData
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
        height: isMobile ? 150 : 300
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
        min: 0,
        minRange: 100
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
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
          states: {
            hover: {
              lineWidth
            }
          },
          threshold: null
        }
      },
      series: [{
        type: 'area',
        name: 'Portfolio value',
        data: data
      }]
    }
    return (
      <div style={{ position: 'relative' }}>
        {this.props.transactions.length === 0 ? (
          <div style={{
            position: 'absolute',
            top: '47%',
            marginTop: '-0.25em',
            marginLeft: '1em',
            width: '100%',
            textAlign: 'center',
            fontSize: 20,
            zIndex: 200,
            padding: '0 100px'
          }}>Enter balances below to track your portfolio</div>) : null}
        <DateRangeSelector
          range={this.props.range}
          baseCurrency={this.props.baseCurrency}
          deviceType={this.props.deviceType}
          setDateRange={this.props.setDateRange} />
        <ReactHighcharts config={chartConfig} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  deviceType: state.app.deviceType,
  isTablet: state.app.isTablet,
  chartData: state.portfolio.chartData,
  transactions: state.transactions.allTransactions,
  range: state.portfolio.range,
  baseCurrency: state.user.baseCurrency
})

export default connect(mapStateToProps, mapDispatchToProps)(NetWorthChart)
