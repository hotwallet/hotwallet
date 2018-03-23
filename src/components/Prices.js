import React from 'react'
import { connect } from 'react-redux'
import { table } from '../lib/styles'
import { Dimmer, Loader, Table } from 'semantic-ui-react'
import * as actions from '../actions'
import { getIsFetchingSecurities, getSecurities, getSecuritiesFailure } from '../reducers'
import PricesRow from './PricesRow'

class Prices extends React.Component {
  componentDidMount() {
    if (!this.props.securities || !this.props.securities.length) {
      this.props.fetchSecurities()
    }
  }

  getRows(securities) {
    return securities && securities.slice(0, 150).map((security, i) =>
      <PricesRow key={security.symbol} security={security} />
    )
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
