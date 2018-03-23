import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { borderColor, lightBlue } from '../lib/styles'
import { addTransaction } from '../actions/transactions'

class PricesInputQty extends React.Component {
  changeValue(e) {
    this.props.addTransaction({
      symbol: this.props.symbol,
      balance: e.target.value
    })
  }

  render() {
    const color = (this.props.hover) ? lightBlue : borderColor
    return (
      <input
        onFocus={e => e.target.select()}
        onChange={e => this.changeValue(e)}
        defaultValue={this.props.balance}
        type="number"
        style={{
          width: 100,
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

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addTransaction
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(PricesInputQty)
