import React from 'react'
import { connect } from 'react-redux'
import { Table, Input, Checkbox, Icon, Image } from 'semantic-ui-react'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'

const rowStyle = {}

const headerStyle = {
  ...rowStyle,
  backgroundColor: 'rgba(0,0,0,.3)'
}

const cellStyle = {
  color: '#fff',
  borderBottom: '1px solid #444',
  padding: '15px 10px',
  verticalAlign: 'top'
}

class ExternalApps extends React.PureComponent {
  toggleApp = event => {
    const el = event.target
    const id = el.parentNode.getAttribute('data-id') || el.getAttribute('data-id')
    const isEnabled = !el.parentNode.classList.value.includes('checked')
    return isEnabled ? this.props.addApp(id) : this.props.removeApp(id)
  }

  getIcon(app) {
    return
    const iconStyle = {
      width: 24,
      display: 'inline-block',
      marginRight: 15
    }
    return app.icon ? (
      <Icon
        size="large"
        name={app.icon}
        style={iconStyle}
      />
    ) : (
      <Image
        src={app.image}
        style={iconStyle}
      />
    )
  }

  render() {
    const rows = this.props.allApps.map(app => (
      <Table.Row key={app.id}>
        <Table.Cell style={cellStyle}>
          {this.getIcon(app)}
          {app.name}
        </Table.Cell>
        <Table.Cell style={{ ...cellStyle, width: 32 }} textAlign="right">
          <Checkbox
            toggle
            data-id={app.id}
            data-name={app.name}
            onClick={this.toggleApp}
            checked={this.props.enabledAppIds.includes(app.id)}
          />
        </Table.Cell>
      </Table.Row>
    ))
    return (
      <div>
        <H1 text="Manage Apps" />
        <div
          style={{
            padding: this.props.isMobile ? mobilePadding : desktopPadding,
            paddingRight: 0
          }}
        >
          <Input inverted icon='search' placeholder='Search...' />
          <Table
            basic="very"
            celled
            compact="very"
            unstackable
          >
            <Table.Header>
              <Table.Row style={headerStyle}>
                <Table.HeaderCell colSpan="2" style={cellStyle}>App</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
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
  isMobile: state.ephemeral.isMobile,
  allApps: state.apps.all,
  enabledAppIds: state.apps.enabled
})

export default connect(mapStateToProps, mapDispatchToProps)(ExternalApps)
