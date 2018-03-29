import React from 'react'
import { connect } from 'react-redux'
import NavLink from './NavLink'
import { Icon } from 'semantic-ui-react'
import { sidebarWidth } from '../lib/styles'

const navItems = [
  { icon: 'home', uri: '/', name: 'Portfolio' },
  { icon: 'setting', uri: '/settings', name: 'Settings' }
]

class SideNav extends React.Component {
  render() {
    return (
      <div>
        <ul style={ulStyle}>
          {this.getNavLinks()}
        </ul>
      </div>
    )
  }

  getNavLinks() {
    return navItems.map((navItem, i) => {
      return (
        <li key={i}>
          <NavLink
            to={navItem.uri}
            name={navItem.name}
            value={<Icon size="large" name={navItem.icon} />}
          />
        </li>
      )
    })
  }
}

const ulStyle = {
  position: 'absolute',
  width: sidebarWidth,
  height: '100%',
  margin: 0,
  padding: 0,
  listStyleType: 'none'
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(SideNav)
