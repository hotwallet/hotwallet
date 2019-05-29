import React from 'react'
import { lightBg, lightBlue, padding } from '../lib/styles'
import { PropTypes } from 'prop-types'
import { connectAccounts } from '../db'
import { accountService } from '../services'
import { compose, withTheme } from '../contexts'


export const dateRanges = [
  {
    isDefault: true,
    label: '1 week',
    granularity: 'day'
  },
  {
    label: '1 month',
    granularity: 'day'
  },
  {
    label: '3 months',
    granularity: 'day'
  },
  {
    label: '1 year',
    granularity: 'day'
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
    if (!this.props.range) return
    if (!this.props.range.label) {
      const defaultRange = dateRanges.find(r => r.isDefault)
      this.props.setDateRange(defaultRange)
    }
  }

  isSelected(range) {
    if (!this.props.range) return false
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

async function getData() {
  return await {    
    range: (await accountService.getPrimaryAccount()).portfolioChartDateRange,
    setDateRange: range => accountService.updateAccount({
      portofolioChartDateRange: range
    })
  }
}

function shouldUpdate(change) {
  return change.affects({  })
}

export default compose(
  withTheme,
  connectAccounts(getData, shouldUpdate)
)(DateRangeSelector)
