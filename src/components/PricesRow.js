import React from 'react'
import { Table, Image } from 'semantic-ui-react'
import {
  formatFiat,
  shortenLargeNumber,
  roundToSignificantFigures,
  formatPercentChange
} from '../lib/formatNumber'
import { borderColor, lightBlue } from '../lib/styles'
import SecurityModal from './SecurityModal'
import PropTypes from 'prop-types'

class PricesRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      inputQtyHover: false,
      isModalOpen: false
    }
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

  getCMCHref() {
    return `https://coinmarketcap.com/currencies/${this.props.security.slug}/`
  }

  formatPrice(num) {
    return formatFiat(num, this.props.baseCurrency)
  }

  render() {
    const isMobile = this.props.isMobile
    const symbolStyle = {
      fontSize: isMobile ? null : 18,
      verticalAlign: 'middle',
      display: isMobile ? 'block' : 'inline'
    }
    const security = this.props.security
    const baseCurrency = this.props.baseCurrency
    const delta24h = formatPercentChange(security.percentChange24h)
    const delta7d = formatPercentChange(security.percentChange7d)
    const supply = security.marketCap / security.price
    const marketCap = shortenLargeNumber(security.marketCap, this.props.baseCurrency)
    const balance = security.balance
    const fiatValue = formatFiat(balance * security.price, baseCurrency)
    const balanceBorderColor = (this.state.hover) ? lightBlue : borderColor
    const getSecurityIcon = label => (
      <div>
        <Image src={this.getIcon(security.symbol)}
          inline
          verticalAlign="middle"
          style={isMobile ? { marginLeft: 6 } : { marginRight: 12 }}
        />
        <span style={symbolStyle}>
          {label}
        </span>
      </div>
    )

    return (
      <Table.Row
        onMouseOver={() => this.mouseOver()}
        onMouseOut={() => this.mouseOut()}
      >
        <SecurityModal
          security={security}
          isModalOpen={this.state.isModalOpen}
          header={getSecurityIcon(security.name)}
          onClose={() => this.setState({ isModalOpen: false })}
          balance={balance}
          addManualTransaction={this.props.addManualTransaction}
          openBinanceSetupModal={this.props.openBinanceSetupModal}
        />

        <Table.Cell>
          <a style={{ color: '#fff' }} href={this.getCMCHref()}>{getSecurityIcon(security.symbol)}</a>
        </Table.Cell>
        <Table.Cell textAlign="right">
          <div>{this.formatPrice(security.price)}</div>
          {isMobile ? (
            <div style={{
              ...delta24h.style,
              fontSize: 10,
              textAlign: 'right'
            }}>{delta24h.value}</div>) : null}
        </Table.Cell>
        {isMobile ? null : <Table.Cell textAlign="right" style={delta24h.style}>{delta24h.value}</Table.Cell>}
        {isMobile ? null : <Table.Cell textAlign="right" style={delta7d.style}>{delta7d.value}</Table.Cell>}
        <Table.Cell textAlign="center">
          <div
            onClick={() => this.setState({ isModalOpen: true })}
            style={{
              cursor: 'pointer',
              width: isMobile ? 80 : 100,
              padding: '0.5em 1em',
              border: `2px solid ${balanceBorderColor}`,
              textAlign: 'center',
              margin: '0 auto'
            }}>{(balance >= 0) ? roundToSignificantFigures(balance) : '\u00A0'}</div>
        </Table.Cell>
        <Table.Cell textAlign="center">
          <div>{balance ? fiatValue : '-'}</div>
          {isMobile ? (
            <div style={{
              color: 'gray',
              fontSize: 10,
              textAlign: 'center'
            }}>{shortenLargeNumber(supply)} / {marketCap}</div>) : null}
        </Table.Cell>
        {isMobile ? null : <Table.Cell textAlign="right">{shortenLargeNumber(supply)}</Table.Cell>}
        {isMobile ? null : <Table.Cell textAlign="right">{marketCap}</Table.Cell>}
      </Table.Row>
    )
  }
}

PricesRow.propTypes = {
  addManualTransaction: PropTypes.func.isRequired,
  openBinanceSetupModal: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  baseCurrency: PropTypes.string.isRequired,
  security: PropTypes.object.isRequired
}

export default PricesRow
