import React from 'react'
import { connect } from 'react-redux'
import { table, desktopPadding, mobilePadding } from '../lib/styles'
import { Dimmer, Loader, Table } from 'semantic-ui-react'
import * as actions from '../actions'
import { getIsFetchingSecurities, getSecurities, getSecuritiesFailure } from '../reducers'
import PricesRow from './PricesRow'
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
    const query = this.props.query
    return securities && securities.slice(0, 100)
      // show balances only toggle
      .filter(security => {
        if (!this.props.balancesOnly || this.props.query) return true
        const balance = this.getBalance(security.symbol)
        return (balance || balance === 0)
      })
      // search query
      .filter(security => {
        if (!query) return true
        const lowerCaseQuery = query.toLowerCase()
        return security.symbol.includes(query.toUpperCase()) ||
          security.name.toLowerCase().includes(lowerCaseQuery)
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
    const isMobile = this.props.isMobile
    const padding = isMobile ? mobilePadding : desktopPadding
    return (
      <div style={{
        padding
      }}>
        <Table inverted unstackable selectable style={table}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Currency</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Price</Table.HeaderCell>
              {isMobile ? null : <Table.HeaderCell textAlign="right">24h</Table.HeaderCell>}
              {isMobile ? null : <Table.HeaderCell textAlign="right">7d</Table.HeaderCell>}
              <Table.HeaderCell textAlign="center">Balance</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Value</Table.HeaderCell>
              {isMobile ? null : <Table.HeaderCell textAlign="right">Supply</Table.HeaderCell>}
              {isMobile ? null : <Table.HeaderCell textAlign="right">Mkt Cap</Table.HeaderCell>}
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
  transactions: state.transactions,
  isMobile: state.app.isMobile,
  query: state.app.filterSymbolsQuery
})

export default connect(mapStateToProps, actions)(Prices)
