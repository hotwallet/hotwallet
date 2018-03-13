import React from 'react'
import { connect } from 'react-redux'
import { table } from '../lib/styles'
import { Dimmer, Loader, Table } from 'semantic-ui-react'
import * as actions from '../actions'
import { getIsFetching } from '../reducers'

class Prices extends React.Component {
  componentDidMount() {
    this.props.fetchSecurities()
  }

  getRows(securities) {
    return securities && securities.map(security =>
      <Table.Row key={security.symbol}>
        <Table.Cell>{security.symbol}</Table.Cell>
        <Table.Cell>{security.price}</Table.Cell>
        <Table.Cell>{security.marketCap}</Table.Cell>
      </Table.Row>
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
        <Table celled inverted selectable style={table}>
          <Table.Body>
            {this.getRows(this.props.securities)}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  securities: state.securities.securities,
  isFetching: getIsFetching(state, 'securities'),
  failureMessage: state.securities.failureMessage
})

export default connect(mapStateToProps, actions)(Prices)
