import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { lightBg, lightBlue, padding } from '../lib/styles'
import { PropTypes } from 'prop-types'
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
function DateRangeSelector({ range, setDateRange, deviceType }) {
  useEffect(() => {
    if (!range.label) {
      const defaultRange = dateRanges.find(r => r.isDefault)
      setDateRange(defaultRange)
    }
  }, [])

  const isSelected = (selectedRange) => {
    const label = range.label
    if (!label && selectedRange.isDefault) return true
    return (selectedRange.label === label)
  }

  const handleDateRangeClick = (e, range) => {
    e.preventDefault()
    setDateRange(range)
  }
  const boxStyle = {
    marginTop: 15,
    marginLeft: padding[deviceType],
    fontSize: 11,
    color
  }
  return (
    <div style={boxStyle}>
      {dateRanges.map(range => {
        const buttonStyle = isSelected(range) ? selected : button
        return (
          <button onClick={e => handleDateRangeClick(e, range)}
            style={buttonStyle}
            key={range.label}>
            {range.label}
          </button>
        )
      })}
    </div>
  )
}

DateRangeSelector.propTypes = {
  range: PropTypes.object.isRequired,
  deviceType: PropTypes.string,
  setDateRange: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  range: state.portfolio.range
})

export default connect(mapStateToProps)(DateRangeSelector)
