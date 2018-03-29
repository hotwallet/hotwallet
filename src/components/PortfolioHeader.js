import React from 'react'
import { connect } from 'react-redux'
import { mobilePadding, desktopPadding, border, smallFontSize } from '../lib/styles'
import { formatFiat } from '../lib/formatNumber'

class PortfolioHeader extends React.Component {
  getTotalValue() {
    const totals = {}
    const baseCurrency = this.props.baseCurrency
    this.props.transactions.forEach(tx => {
      if (totals[tx.symbol] !== undefined) return
      const security = this.props.securities.find(s =>
        s.symbol === tx.symbol && s.baseCurrency === baseCurrency
      )
      if (!security) return
      totals[tx.symbol] = Number(tx.balance) * security.price
    })
    const value = Object.keys(totals).reduce((total, symbol) => total + totals[symbol], 0)
    return formatFiat(value, baseCurrency)
  }

  render() {
    const isMobile = this.props.isMobile
    const padding = isMobile ? mobilePadding : desktopPadding
    const rowStyle = {
      padding,
      fontSize: 20,
      fontWeight: 100,
      margin: 0,
      borderBottom: border
    }
    const colStyle = {
      display: 'inline-block',
      paddingRight: padding,
      borderRight: border,
      marginRight: padding
    }
    const labelStyle = {
      fontSize: smallFontSize
    }
    return (
      <div style={rowStyle}>
        <div style={colStyle}>
          <div style={labelStyle}>Total value</div>
          <div>{this.getTotalValue()}</div>
        </div>
        <div style={colStyle}>
          <div style={labelStyle}>Today</div>
          <div style={{ color: 'gray' }}>-</div>
        </div>
        <div style={colStyle}>
          <div style={labelStyle}>7 day</div>
          <div style={{ color: 'gray' }}>-</div>
        </div>
        <div style={colStyle}>
          <div style={labelStyle}>30 day</div>
          <div style={{ color: 'gray' }}>-</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  transactions: state.transactions,
  securities: state.securities.securities,
  baseCurrency: state.user.baseCurrency
})

export default connect(mapStateToProps)(PortfolioHeader)
