import React from 'react'
import { Table, Image } from 'semantic-ui-react'
import { formatFiat, shortenLargeNumber } from '../lib/formatNumber'
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

  onRowClick() {
    if (this.state.inputQtyHover) return
    this.setState({ isModalOpen: true })
  }

  render() {
    const isMobile = this.props.isMobile
    const symbolStyle = {
      fontSize: isMobile ? null : 18,
      verticalAlign: 'middle'
    }
    const security = this.props.security
    const baseCurrency = this.props.baseCurrency
    const delta24h = this.formatPercentChange(security.percentChange24h)
    const delta7d = this.formatPercentChange(security.percentChange7d)
    const supply = security.marketCap / security.price
    const balance = security.balance
    const fiatValue = formatFiat(balance * security.price, baseCurrency)
    const balanceBorderColor = (this.state.hover) ? lightBlue : borderColor
    const getSecurityIcon = label => (
      <div>
        <Image src={this.getIcon(security.symbol)}
          inline
          verticalAlign="middle"
          style={{marginRight: 12}}
        />
        <span style={symbolStyle}>
          {label}
        </span>
      </div>
    )

    return (
      <Table.Row
        onClick={() => this.onRowClick()}
        onMouseOver={() => this.mouseOver()}
        onMouseOut={() => this.mouseOut()}
        style={{ cursor: 'pointer' }}
      >
        <SecurityModal
          security={security}
          isModalOpen={this.state.isModalOpen}
          header={getSecurityIcon(security.name)}
          onClose={() => this.setState({ isModalOpen: false })}
          balance={balance}
          addManualTransaction={this.props.addManualTransaction}
        />

        <Table.Cell>{getSecurityIcon(security.symbol)}</Table.Cell>
        <Table.Cell textAlign="right">{this.formatPrice(security.price)}</Table.Cell>
        {isMobile ? null : <Table.Cell textAlign="right" style={delta24h.style}>{delta24h.value}</Table.Cell>}
        {isMobile ? null : <Table.Cell textAlign="right" style={delta7d.style}>{delta7d.value}</Table.Cell>}
        <Table.Cell textAlign="center">
          <div style={{
            width: isMobile ? 80 : 100,
            padding: isMobile ? '0.25em 1em' : '0.5em 1em',
            border: `2px solid ${balanceBorderColor}`,
            textAlign: 'center'
          }}>{balance || '\u00A0'}</div>
        </Table.Cell>
        <Table.Cell textAlign="center">{balance ? fiatValue : '-'}</Table.Cell>
        {isMobile ? null : <Table.Cell textAlign="right">{shortenLargeNumber(supply)}</Table.Cell>}
        {isMobile ? null : <Table.Cell textAlign="right">{shortenLargeNumber(security.marketCap, this.props.baseCurrency)}</Table.Cell>}
      </Table.Row>
    )
  }
}

PricesRow.propTypes = {
  addManualTransaction: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
  baseCurrency: PropTypes.string.isRequired,
  security: PropTypes.object.isRequired
}

export default PricesRow
