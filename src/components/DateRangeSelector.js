import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import { lightBg, lightBlue } from '../lib/styles'
import { setDateRange } from '../actions/portfolio'

const dateFormat = 'YYYY-MM-DD'

const today = moment().utc().format(dateFormat)

const dateRanges = [
  {
    isDefault: true,
    label: '1 month',
    startDate: moment().utc().subtract(1, 'months').format(dateFormat),
    endDate: today,
    granularity: 'day'
  },
  {
    label: '3 months',
    startDate: moment().utc().subtract(3, 'months').format(dateFormat),
    endDate: today,
    granularity: 'week'
  },
  {
    label: '1 year',
    startDate: moment().utc().subtract(12, 'months').format(dateFormat),
    endDate: today,
    granularity: 'month'
  }
]

const color = '#999'

const boxStyle = {
  marginTop: 15,
  marginLeft: 25,
  fontSize: 11,
  color
}

const button = {
  display: 'inline-block',
  borderBottom: `1px solid ${lightBg}`,
  paddingBottom: 5,
  marginRight: 20,
  marginBottom: 5,
  color,
  textTransform: 'uppercase'
}

const selected = {
  ...button,
  borderBottom: `1px solid ${lightBlue}`
}

class DateRangeSelector extends React.Component {
  componentDidMount() {}

  isSelected(range) {
    const label = this.props.label
    if (!label && range.isDefault) return true
    return (range.label === label)
  }

  handleDateRangeClick(e, range) {
    e.preventDefault()
    this.props.setDateRange(range)
  }

  render() {
    return (
      <div style={boxStyle}>
        {dateRanges.map(range => {
          const buttonStyle = this.isSelected(range) ? selected : button
          return (
            <a href="#" onClick={e => this.handleDateRangeClick(e, range)}
              style={buttonStyle}
              key={range.label}>
              {range.label}
            </a>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = state => state.portfolio.range

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setDateRange
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(DateRangeSelector)
