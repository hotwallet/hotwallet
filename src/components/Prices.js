import React from 'react'
import { table, desktopPadding, mobilePadding } from '../lib/styles'
import { Dimmer, Loader, Table } from 'semantic-ui-react'
import PricesRow from './PricesRow'

class Prices extends React.Component {
  getRows(securities) {
    return securities.map(security => (
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
        <div>Failed to fetch symbols:  {this.props.failureMessage} </div>
      )
    }
    const isMobile = this.props.isMobile
    const isDesktop = this.props.isDesktop
    const padding = isMobile ? mobilePadding : desktopPadding
    return (
      <div style={{
        padding,
        paddingRight: isDesktop ? 0 : padding
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

export default Prices
