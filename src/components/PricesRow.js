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
import { borderColor } from '../lib/styles'
import { rowsPerPage } from '../selectors/securitiesSelectors'
import PropTypes from 'prop-types'
import client from '../lib/tarragonClient'

class PricesRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputQtyHover: false,
      isModalOpen: false
    }
    this.iconSrc = this.getIcon(this.props.security.symbol)
    this.balanceBorderTimer = null
  }

  handleVisibilityChange = (e, data) => {
    const { calculations } = data
    const rowIndex = data.rowindex
    if (rowIndex % rowsPerPage !== 0) return
    if (calculations.offScreen) {
      return
    }
    this.props.setLastVisibleRow(rowIndex)
  }

  componentDidMount() {
    this.unsubscribe = client.socket.subscribe(this.props.security.symbol)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  toggleBalanceBorder = () => {
    clearTimeout(this.balanceBorderTimer)
    this.balanceBorderTimer = setTimeout(() => {
      // TODO: re-render only the input component with lightBlue border color
      // console.log('toggle balance border', this.props.symbol)
    }, 250)
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
    const security = this.props.security
    const baseCurrency = this.props.baseCurrency
    const delta24h = formatPercentChange(security.percentChange24h)
    const delta7d = formatPercentChange(security.percentChange7d)
    const supply = security.marketCap / security.price
    const marketCap = shortenLargeNumber(security.marketCap, this.props.baseCurrency)
    const balance = security.balance
    const fiatValue = formatFiat(balance * security.price, baseCurrency)
    const balanceBorderColor = borderColor

    const rank = this.props.rowIndex + 1

    const symbolStyle = {
      fontSize: isMobile ? null : 18,
      verticalAlign: 'middle',
      display: isMobile ? 'block' : 'inline'
    }
    const rankStyle = {
      color: 'gray',
      marginRight: 10,
      fontSize: 10,
      position: isMobile ? 'absolute' : 'relative',
      left: isMobile ? 40 : 0
    }

    return (
      <Table.Row
        onMouseOver={this.toggleBalanceBorder}
        onMouseOut={this.toggleBalanceBorder}
      >
        <Table.Cell>
          {(this.props.rowIndex % rowsPerPage === 0) ? (
            <Visibility
              fireOnMount
              rowindex={this.props.rowIndex}
              onUpdate={this.handleVisibilityChange}
            />
          ) : null}
          <a
            style={{ color: '#fff', whiteSpace: 'nowrap' }}
            href={this.getCMCHref()}
          >
            <span style={rankStyle}>{rank}</span>
            <Image
              src={this.iconSrc}
              inline
              verticalAlign="middle"
              style={{ marginRight: 10 }}
            />
            <span style={symbolStyle}>{security.symbol}</span>

          </a>
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
            onClick={() => {
              this.props.openSecurityModal({
                security: this.props.security,
                iconSrc: this.iconSrc
              })
            }}
            style={{
              cursor: 'pointer',
              width: isMobile ? 75 : 100,
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
  removeManualTransactions: PropTypes.func.isRequired,
  openBinanceSetupModal: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  baseCurrency: PropTypes.string.isRequired,
  security: PropTypes.object.isRequired,
  rowIndex: PropTypes.number.isRequired,
  setLastVisibleRow: PropTypes.func.isRequired,
  openSecurityModal: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => ({
  // security: getSecurityWithBalance(state, props.symbol)
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesRow)
