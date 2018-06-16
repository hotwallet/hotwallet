import React from 'react'
import { connect } from 'react-redux'
import { Table, Image, Visibility } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'
import {
  formatFiat,
  shortenLargeNumber,
  roundToSignificantFigures,
  formatPercentChange
} from '../lib/formatNumber'
import { borderColor, lightBlue } from '../lib/styles'
import SecurityModal from './SecurityModal'
import { rowsPerPage, getSecurityWithBalance } from '../selectors/securitiesSelectors'
// import { getBalanceForSymbol } from '../selectors/transactionSelectors'
import PropTypes from 'prop-types'

class PricesRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      inputQtyHover: false,
      isModalOpen: false
    }
  }

  handleVisibilityChange(e, data) {
    const { calculations } = data
    const rowIndex = data.rowindex
    if (rowIndex % rowsPerPage !== 0) return
    if (calculations.offScreen) {
      return
    }
    let first = (rowIndex <= rowsPerPage) ? 0 : rowIndex - (2 * rowsPerPage)
    let last = rowIndex + (2 * rowsPerPage)
    this.props.setRowSlice([first, last])
  }

  mouseOver() {
    this.setState(state => ({ hover: true }))
  }

  mouseOut() {
    this.setState(state => ({ hover: false }))
  }

  getIcon(symbol) {
    const size = this.props.isMobile ? '16x16' : '32x32'
    return `https://chnnl.imgix.net/tarragon/icons/${size}/${symbol}.png`
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
    console.log('PricesRow', security.symbol, 'render')
    const baseCurrency = this.props.baseCurrency
    const delta24h = formatPercentChange(security.percentChange24h)
    const delta7d = formatPercentChange(security.percentChange7d)
    const supply = security.marketCap / security.price
    const marketCap = shortenLargeNumber(security.marketCap, this.props.baseCurrency)
    // const balance = this.props.balance
    const balance = security.balance
    const fiatValue = formatFiat(balance * security.price, baseCurrency)
    const balanceBorderColor = (this.state.hover) ? lightBlue : borderColor
    const getSecurityIcon = label => (
      <div>
        <span style={{ color: 'gray', marginRight: 10, fontSize: 10 }}>
          {this.props.rowIndex + 1}
        </span>
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
          {(this.props.rowIndex % rowsPerPage === 0) ? (
            <Visibility
              rowindex={this.props.rowIndex}
              onUpdate={(e, data) => this.handleVisibilityChange(e, data)}
            />
          ) : null}
          <a
            style={{ color: '#fff' }}
            href={this.getCMCHref()}>{getSecurityIcon(security.symbol)}</a>
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
              textAlign: 'center',
              whiteSpace: 'nowrap'
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
  // security: PropTypes.object.isRequired,
  symbol: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  setRowSlice: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => ({
  // security: state.securities.bySymbol[props.symbol],
  // balance: getBalanceForSymbol(state, props.symbol),
  security: getSecurityWithBalance(state, props.symbol)
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesRow)
