import React from 'react'
import isNumeric from '../lib/isNumeric'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'

class PricesInputQty extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hasFocused: false
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
    return (
      <Input
        fluid
        inverted
        ref={ref => {
          if (ref && !isMobile && !this.state.hasFocused) {
            ref.focus()
            this.setState({ hasFocused: true })
          }
        }}
        disabled={this.props.disabled}
        min={0}
        onFocus={e => e.target.select()}
        onKeyUp={e => this.validateValue(e)}
        onChange={e => {
          this.validateValue(e)
          this.props.setBalance(e.target.value)
        }}
        defaultValue={this.props.balance}
        type="number"
        label={{ basic: true, content: this.props.symbol }}
        labelPosition="right"
      />
    )
  }
}

PricesInputQty.propTypes = {
  setBalance: PropTypes.func,
  balance: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  disabled: PropTypes.bool
}

export default PricesInputQty
