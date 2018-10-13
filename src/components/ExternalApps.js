import React from 'react'
import { connect } from 'react-redux'
import { Table } from 'semantic-ui-react'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'

class ExternalApps extends React.PureComponent {
  constructor(props) {
    super(props)

    // TODO: get the list of apps from the server
    const apps = [
      {
        name: 'HotWallet Demo App',
        id: 'hotwallet-app-demo'
      }
    ]
    this.state = { apps }
  }

  render() {
    const rows = this.state.apps.map(app => (
      <Table.Row key={app.id}>
        <Table.Cell>
          {app.name}
        </Table.Cell>
      </Table.Row>
    ))
    return (
      <div>
        <H1 text="Apps" />
        <div
          style={{
            padding: this.props.isMobile ? mobilePadding : desktopPadding
          }}
        >
          <Table
            basic="very"
            celled
            compact="very"
            unstackable
          >
            <Table.Body>
              {rows}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(ExternalApps)
