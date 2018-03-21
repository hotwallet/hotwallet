import React from 'react'
import { connect } from 'react-redux'
import { table } from '../lib/styles'
import { Dimmer, Loader, Table, Image } from 'semantic-ui-react'
import * as actions from '../actions'
import { getIsFetchingSecurities, getSecurities, getSecuritiesFailure } from '../reducers'
import { formatFiat, shortenLargeNumber } from '../lib/formatNumber'

class Prices extends React.Component {
  componentDidMount() {
    if (!this.props.securities || !this.props.securities.length) {
      this.props.fetchSecurities()
    }
  }

  getIcon(symbol) {
    return `https://chnnl.s3.amazonaws.com/tarragon/icons/16x16/${symbol}.png`
  }

  formatPrice(num) {
    return formatFiat(num, this.props.baseCurrency)
  }

  getRows(securities) {
    return securities && securities.slice(0, 150).map((security, i) => {
      const rank = i + 1
      let deltaStyle
      let delta = '-'
      if (Number(security.percentChange7d) > 0) {
        deltaStyle = { color: 'green' }
        delta = `+${security.percentChange7d}%`
      }
      if (Number(security.percentChange7d) < 0) {
        deltaStyle = { color: 'red' }
        delta = `${security.percentChange7d}%`
      }
      return (
        <Table.Row key={security.symbol}>
          <Table.Cell>{rank}</Table.Cell>
          <Table.Cell>
            <Image src={this.getIcon(security.symbol)}
              inline={true}
              verticalAlign="middle"
              style={{ marginRight: 10 }}
            />
            {security.name}
          </Table.Cell>
          <Table.Cell textAlign="right">{this.formatPrice(security.price)}</Table.Cell>
          <Table.Cell textAlign="right" style={deltaStyle}>{delta}</Table.Cell>
          <Table.Cell textAlign="center">{0}</Table.Cell>
          <Table.Cell textAlign="center">{0}</Table.Cell>
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
              <Table.HeaderCell textAlign="right">Change</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Quantity</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Value</Table.HeaderCell>
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
