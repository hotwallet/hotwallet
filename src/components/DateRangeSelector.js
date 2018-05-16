import React from 'react'
import moment from 'moment'
import { lightBg, lightBlue, padding } from '../lib/styles'
import { PropTypes } from 'prop-types'

const dateFormat = 'YYYY-MM-DD'

const today = moment().utc().format(dateFormat)

const dateRanges = [
  {
    isDefault: true,
    label: '1 week',
    startDate: moment().utc().subtract(1, 'week').format(dateFormat),
    endDate: today,
    granularity: 'day'
  },
  {
    label: '1 month',
    startDate: moment().utc().subtract(1, 'month').format(dateFormat),
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

const color = 'gray'

const button = {
  display: 'inline-block',
  border: 'none',
  outline: 'none',
  borderBottom: `1px solid ${lightBg}`,
  padding: 0,
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

class DateRangeSelector extends React.PureComponent {
  componentDidMount() {
    if (!this.props.range.startDate) {
      const defaultRange = dateRanges.find(r => r.isDefault)
      this.props.setDateRange(defaultRange)
    }
  }

  isSelected(range) {
    const label = this.props.range.label
    if (!label && range.isDefault) return true
    return (range.label === label)
  }

  handleDateRangeClick(e, range) {
    e.preventDefault()
    this.props.setDateRange(range)
  }

  render() {
    const boxStyle = {
      marginTop: 15,
      marginLeft: padding[this.props.deviceType],
      fontSize: 11,
      color
    }
    return (
      <div style={boxStyle}>
        {dateRanges.map(range => {
          const buttonStyle = this.isSelected(range) ? selected : button
          return (
            <button onClick={e => this.handleDateRangeClick(e, range)}
              style={buttonStyle}
              key={range.label}>
              {range.label}
            </button>
          )
        })}
      </div>
    )
  }
}

DateRangeSelector.propTypes = {
  range: PropTypes.object.isRequired,
  deviceType: PropTypes.string,
  setDateRange: PropTypes.func.isRequired
}

export default DateRangeSelector
