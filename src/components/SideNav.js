import React from 'react'
import { connect } from 'react-redux'
import NavLink from './NavLink'
import { border, sidebarWidth } from '../lib/styles'

const navItems = {
  Portfolio: '/',
  Counter: '/counter',
  Settings: '/settings'
}

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
    return Object.keys(navItems).map((name, i) => {
      const uri = navItems[name]
      return (
        <li key={i}>
          <NavLink to={uri} name={name} />
        </li>
      )
    })
  }
}

const ulStyle = {
  position: 'fixed',
  width: sidebarWidth,
  borderRight: border,
  height: '100%',
  margin: 0,
  padding: 0,
  listStyleType: 'none'
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(SideNav)
