import React from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import DateRangeSelector from './DateRangeSelector'
import data from '../lib/sample-chart-data'
import { lightBlue, darkBlue, darkBg, desktopPadding, mobilePadding } from '../lib/styles'

const gridLineColor = '#323a42'
const gridLineWidth = 2
const lineColor = lightBlue
const lineWidth = 1.5

class NetWorthChart extends React.Component {
  render() {
    const isMobile = this.props.isMobile
    const isTablet = this.props.isTablet
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
        gridLineColor
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
      <div>
        <DateRangeSelector />
        <ReactHighcharts config={chartConfig} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  isTablet: state.app.isTablet
})

export default connect(mapStateToProps)(NetWorthChart)
