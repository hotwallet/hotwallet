import React from 'react'
import isNumeric from '../lib/isNumeric'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'

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
    return (
      <Input
        fluid
        inverted
        disabled={this.props.disabled}
        min={0}
        onFocus={e => e.target.select()}
        onKeyUp={e => this.validateValue(e)}
        onChange={e => this.changeValue(e)}
        defaultValue={this.props.balance}
        type="number"
        label={{ basic: true, content: this.props.symbol }}
        labelPosition="right"
      />
    )
  }
}

PricesInputQty.propTypes = {
  addManualTransaction: PropTypes.func,
  balance: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  disabled: PropTypes.bool
}

export default PricesInputQty
