import React from 'react'
import { connect } from 'react-redux'
import { Table, Image } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'
import { formatFiat, shortenLargeNumber } from '../lib/formatNumber'
import PricesInputQty from './PricesInputQty'

class PricesRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hover: false }
  }

  mouseOver() {
    this.setState(state => ({ hover: true }))
  }

  mouseOut() {
    this.setState(state => ({ hover: false }))
  }

  getIcon(symbol) {
    const size = this.props.isMobile ? '16x16' : '32x32'
    return `https://chnnl.s3.amazonaws.com/tarragon/icons/${size}/${symbol}.png`
  }

  formatPrice(num) {
    return formatFiat(num, this.props.baseCurrency)
  }

  formatPercentChange(num) {
    if (Number(num) > 0) {
      return {
        style: { color: 'lightgreen' },
        value: `+${num}%`
      }
    }
    if (Number(num) < 0) {
      return {
        style: { color: 'red' },
        value: `${num}%`
      }
    }
    return {
      style: {},
      value: '-'
    }
  }

  render() {
    const isMobile = this.props.isMobile
    const symbolStyle = {
      fontSize: isMobile ? null : 18,
      verticalAlign: 'inherit'
    }
    const security = this.props.security
    const baseCurrency = this.props.baseCurrency
    const delta24h = this.formatPercentChange(security.percentChange24h)
    const delta7d = this.formatPercentChange(security.percentChange7d)
    const supply = security.marketCap / security.price
    const balance = security.balance
    const fiatValue = formatFiat(balance * security.price, baseCurrency)
    return (
      <Table.Row
        onMouseOver={() => this.mouseOver()}
        onMouseOut={() => this.mouseOut()}
      >
        <Table.Cell>
          <Image src={this.getIcon(security.symbol)}
            inline
            verticalAlign="middle"
            style={{marginRight: 10}}
          />
          <span style={symbolStyle}>
            {security.symbol}
          </span>
        </Table.Cell>
        <Table.Cell textAlign="right">{this.formatPrice(security.price)}</Table.Cell>
        {isMobile ? null : <Table.Cell textAlign="right" style={delta24h.style}>{delta24h.value}</Table.Cell>}
        {isMobile ? null : <Table.Cell textAlign="right" style={delta7d.style}>{delta7d.value}</Table.Cell>}
        <Table.Cell textAlign="center">
          <PricesInputQty
            hover={this.state.hover}
            symbol={security.symbol}
            balance={balance}
          />
        </Table.Cell>
        <Table.Cell textAlign="center">{balance ? fiatValue : '-'}</Table.Cell>
        {isMobile ? null : <Table.Cell textAlign="right">{shortenLargeNumber(supply)}</Table.Cell>}
        {isMobile ? null : <Table.Cell textAlign="right">{shortenLargeNumber(security.marketCap, this.props.baseCurrency)}</Table.Cell>}
      </Table.Row>
    )
  }
}

const mapStateToProps = state => ({
  baseCurrency: state.user.baseCurrency,
  transactions: state.transactions,
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesRow)
