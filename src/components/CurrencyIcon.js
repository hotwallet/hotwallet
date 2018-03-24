import React from 'react'
import { connect } from 'react-redux'

class CurrencyIcon extends React.Component {
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

const flagStyle = {
  display: 'inline-block',
  position: 'relative',
  margin: '0 5px 0 8px',
  top: 3
}

const mapStateToProps = state => ({
  baseCurrency: state.user.baseCurrency
})

export default connect(mapStateToProps)(CurrencyIcon)
