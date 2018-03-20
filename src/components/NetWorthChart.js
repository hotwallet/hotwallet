import React from 'react'
import { connect } from 'react-redux'
import ReactHighcharts from 'react-highcharts'
import Highcharts from 'highcharts'
import HighchartsExporter from 'highcharts/modules/exporting'
import DateRangeSelector from './DateRangeSelector'
import data from '../lib/sample-chart-data'
import { lightBlue, darkBlue, darkBg } from '../lib/styles'

const gridLineColor = '#323a42'
const gridLineWidth = 2
const lineColor = lightBlue
const lineWidth = 1.5

const config = {
  chart: {
    // zoomType: 'x',
    backgroundColor: null,
    plotBackgroundColor: darkBg,
    spacing: [25, 25, 25, 25]
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

class NetWorthChart extends React.Component {
  async componentDidMount() {
    HighchartsExporter(Highcharts)
  }

  render() {
    return (
      <div>
        <DateRangeSelector />
        <ReactHighcharts config={config} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  count: state.counter.count
})

export default connect(mapStateToProps)(NetWorthChart)
