import React from 'react'
import { PropTypes } from 'prop-types'

class CurrencyIcon extends React.PureComponent {
  render() {
    const currency = this.props.currency
    const flagClass = `currency-flag currency-flag-${currency.toLowerCase()}`
    return (
      <div style={this.props.style}>
        <div style={{ textAlign: 'left' }}>
          <span style={{ width: 35, display: 'inline-block' }}>{currency}</span>
          <span className={flagClass} style={flagStyle} />
        </div>
      </div>
    )
  }
}

CurrencyIcon.propTypes = {
  currency: PropTypes.string.isRequired,
  style: PropTypes.object
}

const flagStyle = {
  display: 'inline-block',
  position: 'relative',
  margin: '0 5px 0 8px',
  top: 3
}

export default CurrencyIcon
