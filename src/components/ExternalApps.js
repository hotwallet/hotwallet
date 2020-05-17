import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Input, Checkbox } from 'semantic-ui-react'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { withTheme, compose } from '../contexts'
import { useVenti } from 'venti'
import { addApp, removeApp } from '../ventiStore/apps'

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

function ExternalApps({ isMobile }) {
  const state = useVenti()
  const sideBarApps = state.get(`apps.sideBarApps`, [])
  const enabled = state.get(`apps.enabled`, [])
  console.log('state', state)

  const toggleApp = event => {
    const el = event.target
    const id = el.parentNode.getAttribute('data-id') || el.getAttribute('data-id')
    const isEnabled = !el.parentNode.classList.value.includes('checked')
    return isEnabled ? addApp(id) : removeApp(id)
  }

  const getIcon = (app) => {
    // const iconStyle = {
    //   width: 24,
    //   display: 'inline-block',
    //   marginRight: 15
    // }
    // return app.icon ? (
    //   <Icon
    //     size="large"
    //     name={app.icon}
    //     style={iconStyle}
    //   />
    // ) : (
    //   <Image
    //     src={app.image}
    //     style={iconStyle}
    //   />
    // )
  }

  const getLink = (appId) => {
    const prefix = 'hotwallet-app-'
    return appId.includes(prefix)
      ? `/apps/${appId.replace('hotwallet-app-', '')}`
      : `/${appId}`
  }

  const getRows = () => {
    return sideBarApps.map(app => (
      <Table.Row key={app.id}>
        <Table.Cell style={cellStyle}>
          {getIcon(app)}
          <Link
            style={{ color: '#eee', fontSize: 16 }}
            to={getLink(app.id)}
          >{app.name}</Link>
        </Table.Cell>
        <Table.Cell style={{ ...cellStyle, width: 32 }} textAlign="right">
          <Checkbox
            style={{ marginRight: 15 }}
            toggle
            data-id={app.id}
            data-name={app.name}
            onClick={toggleApp}
            checked={enabled.includes(app.id)}
          />
        </Table.Cell>
      </Table.Row>
    ))
  }

  return (
    <div>
      <H1 text="Manage Apps" />
      <div
        style={{
          padding: isMobile ? mobilePadding : desktopPadding,
          paddingRight: 0
        }}
      >
        <Input inverted icon="search" placeholder="Search..." />
        <Table
          basic="very"
          celled
          compact="very"
          unstackable
        >
          <Table.Header>
            <Table.Row style={headerStyle}>
              <Table.HeaderCell style={cellStyle}>App</Table.HeaderCell>
              <Table.HeaderCell style={cellStyle}>Shortcut</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {getRows()}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default compose(
  withTheme
)(ExternalApps)
