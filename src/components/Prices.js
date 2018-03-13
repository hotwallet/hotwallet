import React from 'react'
import { connect } from 'react-redux'
import client from '../lib/tarragonClient'
import { bindActionCreators } from 'redux'
import { table } from '../lib/styles'
import { Dimmer, Loader, Table } from 'semantic-ui-react'

class Prices extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isFetching: false
    }
  }

  async componentDidMount() {
    this.setState({ isFetching: true })
    const securities = await client.get('/securities')
    this.setState({
      isFetching: false,
      rows: this.getRows(securities)
    })
  }

  getRows(securities) {
    return securities.map(security =>
      <Table.Row key={security.symbol}>
        <Table.Cell>{security.symbol}</Table.Cell>
        <Table.Cell>{security.price}</Table.Cell>
        <Table.Cell>{security.marketCap}</Table.Cell>
      </Table.Row>
    )
  }

  render() {
    if (this.state.isFetching) {
      return (
        <Dimmer active>
          <Loader inverted content="Loading" />
        </Dimmer>
      )
    }
    return (
      <div className="pad">
        <Table celled inverted selectable style={table}>
          <Table.Body>
            {this.state.rows}
          </Table.Body>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment: () => ({ type: 'counter.increment' }),
      decrement: () => ({ type: 'counter.decrement' }),
      setSize: size => ({ type: 'counter.setSize', size })
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Prices)
