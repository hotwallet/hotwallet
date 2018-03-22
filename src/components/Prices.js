import React from 'react'
import { connect } from 'react-redux'
import { table } from '../lib/styles'
import { Dimmer, Loader, Table, Image } from 'semantic-ui-react'
import * as actions from '../actions'
import { getIsFetchingSecurities, getSecurities, getSecuritiesFailure } from '../reducers'
import { formatFiat, shortenLargeNumber } from '../lib/formatNumber'

const symbolStyle = {
  fontSize: 18,
  verticalAlign: 'inherit'
}

class Prices extends React.Component {
  componentDidMount() {
    if (!this.props.securities || !this.props.securities.length) {
      this.props.fetchSecurities()
    }
  }

  getIcon(symbol) {
    return `https://chnnl.s3.amazonaws.com/tarragon/icons/32x32/${symbol}.png`
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

  getRows(securities) {
    return securities && securities.slice(0, 150).map((security, i) => {
      const rank = i + 1
      const delta24h = this.formatPercentChange(security.percentChange24h)
      const delta7d = this.formatPercentChange(security.percentChange7d)
      const supply = security.marketCap / security.price
      return (
        <Table.Row key={security.symbol}>
          <Table.Cell>{rank}</Table.Cell>
          <Table.Cell>
            <Image src={this.getIcon(security.symbol)}
              inline={true}
              verticalAlign="middle"
              style={{marginRight: 25}}
            />
            <span style={symbolStyle}>
              {security.symbol}
            </span>
          </Table.Cell>
          <Table.Cell textAlign="right">{this.formatPrice(security.price)}</Table.Cell>
          <Table.Cell textAlign="right" style={delta24h.style}>{delta24h.value}</Table.Cell>
          <Table.Cell textAlign="right" style={delta7d.style}>{delta7d.value}</Table.Cell>
          <Table.Cell textAlign="center">{0}</Table.Cell>
          <Table.Cell textAlign="center">{0}</Table.Cell>
          <Table.Cell textAlign="right">{shortenLargeNumber(supply)}</Table.Cell>
          <Table.Cell textAlign="right">{shortenLargeNumber(security.marketCap, this.props.baseCurrency)}</Table.Cell>
        </Table.Row>
      )
    })
  }

  render() {
    if (this.props.isFetching) {
      return (
        <Dimmer active>
          <Loader inverted content="Loading" />
        </Dimmer>
      )
    }
    if (this.props.failureMessage) {
      return (
        <div> {this.props.failureMessage} </div>
      )
    }
    return (
      <div className="pad">
        <Table inverted selectable style={table}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Rank</Table.HeaderCell>
              <Table.HeaderCell>Currency</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Price</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">24h</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">7d</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Quantity</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Value</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Supply</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Mkt Cap</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.getRows(this.props.securities)}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  baseCurrency: state.user.baseCurrency,
  securities: getSecurities(state),
  isFetching: getIsFetchingSecurities(state),
  failureMessage: getSecuritiesFailure(state)
})

export default connect(mapStateToProps, actions)(Prices)
