import React from 'react'
import { connect } from 'react-redux'
import { borderColor, lightBlue } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import isNumeric from '../lib/isNumeric'

class PricesInputQty extends React.Component {
  changeValue(e) {
    const value = e.target.value
    if (this.validateValue(e)) {
      this.props.addTransaction({
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
    const color = (this.props.hover) ? lightBlue : borderColor
    return (
      <input
        min={0}
        onFocus={e => e.target.select()}
        onKeyUp={e => this.validateValue(e)}
        onChange={e => this.changeValue(e)}
        defaultValue={this.props.balance}
        type="number"
        style={{
          width: isMobile ? 80 : 100,
          backgroundColor: 'none',
          padding: '0.5em 0.5em 0.5em 1em',
          border: `1px solid ${color}`,
          textAlign: 'center',
          outline: 'none'
        }}
      />
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesInputQty)
