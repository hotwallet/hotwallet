import React from 'react'
import { borderColor, lightBlue } from '../lib/styles'
import isNumeric from '../lib/isNumeric'
import PropTypes from 'prop-types'

class PricesInputQty extends React.PureComponent {
  changeValue(e) {
    const value = e.target.value
    if (this.validateValue(e)) {
      this.props.addManualTransaction({
        symbol: this.props.symbol,
        balance: value
      })
    }
  }

  validateValue(e) {
    const value = e.target.value
    if (!isNumeric(value) || value < 0) {
      e.target.value = ''
      return false
    }
    return true
  }

  render() {
    const isMobile = this.props.isMobile
    const color = (this.props.isRowHover) ? lightBlue : borderColor
    return (
      <input
        ref={ref => {
          if (ref) ref.focus()
        }}
        min={0}
        // onFocus={e => e.target.select()}
        onKeyUp={e => this.validateValue(e)}
        onChange={e => this.changeValue(e)}
        defaultValue={this.props.balance}
        type="number"
        style={{
          width: isMobile ? 90 : 110,
          backgroundColor: 'none',
          padding: isMobile ? '0.25em 0.5em 0.25em 1em' : '0.5em 0.5em 0.5em 1em',
          border: `2px solid ${color}`,
          textAlign: 'center',
          outline: 'none'
        }}
      />
    )
  }
}

PricesInputQty.propTypes = {
  addManualTransaction: PropTypes.func.isRequired,
  balance: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  isMobile: PropTypes.bool
}

export default PricesInputQty
