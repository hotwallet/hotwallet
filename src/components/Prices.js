import React from 'react'
import { connect } from 'react-redux'
import { table } from '../lib/styles'
import { Dimmer, Loader, Table } from 'semantic-ui-react'
import * as actions from '../actions'
import { getIsFetchingSecurities, getSecurities, getSecuritiesFailure } from '../reducers'
import PricesRow from './PricesRow'
import PricesFilters from './PricesFilters'
import moment from 'moment'

class Prices extends React.Component {
  componentDidMount() {
    // fetch all prices if they haven't been updated in the past 2 minutes
    const updatedAt = this.props.updatedAt
    const diff = moment().diff(updatedAt, 'seconds')
    if (!updatedAt || diff > 120) {
      this.props.fetchSecurities()
    }
  }

  // TODO: this function is also in PricesRow:54
  getBalance(symbol) {
    // TODO: account for multiple wallets
    const latestTx = this.props.transactions.find(tx => tx.symbol === symbol)
    if (latestTx) return latestTx.balance
  }

  getRows(securities) {
    return securities && securities.slice(0, 100)
      .filter(security => {
        if (!this.props.balancesOnly) return true
        const balance = this.getBalance(security.symbol)
        if (balance || balance === 0) return true
      })
      .map((security, i) => (
        <PricesRow key={security.symbol} security={security} />
      ))
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
        <PricesFilters />
        <Table inverted selectable style={table}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Rank</Table.HeaderCell>
              <Table.HeaderCell>Currency</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Price</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">24h</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">7d</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Balance</Table.HeaderCell>
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
  updatedAt: state.securities.updatedAt,
  baseCurrency: state.user.baseCurrency,
  securities: getSecurities(state),
  isFetching: getIsFetchingSecurities(state),
  failureMessage: getSecuritiesFailure(state),
  balancesOnly: state.securities.balancesOnly,
  transactions: state.transactions
})

export default connect(mapStateToProps, actions)(Prices)
