import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import NavLink from './NavLink'
import { Icon, Image } from 'semantic-ui-react'
import { sidebarWidth } from '../lib/styles'

const defaultNavItems = [
  { icon: 'pie chart', uri: '/', name: 'Portfolio' },
  { image: 'https://chnnl.s3.amazonaws.com/tarragon/hardware/128x128/ledger.png', uri: '/ledger', name: 'Ledger Connect' },
  { image: 'https://chnnl.s3.amazonaws.com/tarragon/hardware/64x64/trezor.png', uri: '/trezor', name: 'Trezor Connect' },
  { image: 'https://chnnl.s3.amazonaws.com/tarragon/exchanges/64x64/binance.png', uri: '/binance', name: 'Binance Connect' }
  // { icon: 'setting', uri: '/settings', name: 'Settings' },
]

const lastNavItem = { icon: 'add', uri: '/apps', name: 'Apps' }

const customNavItems = [
  { icon: 'coffee', uri: '/apps/demo', name: 'Demo App' }
]

const ulStyle = {
  position: 'absolute',
  height: '100%',
  margin: 0,
  padding: 0,
  listStyleType: 'none'
}

class SideNav extends React.PureComponent {
  render() {
    const width = this.props.width || sidebarWidth
    return (
      <div>
        <ul style={{ ...ulStyle, width }}>
          {this.getNavLinks()}
        </ul>
      </div>
    )
  }

  getNavLinks() {
    const isMobile = this.props.isMobile
    const navItems = defaultNavItems
      .concat(customNavItems)
      .concat([lastNavItem])
    return navItems.map((navItem, i) => {
      const mobileItem = (
        <div style={{ lineHeight: '1.5em' }}>
          {navItem.icon ? (
            <Icon
              size="large"
              name={navItem.icon}
              style={{
                verticalAlign: 'top',
                marginRight: 10
              }}
            />
          ) : (
            <Image
              src={navItem.image}
              style={{
                display: 'inline-block',
                width: 24,
                marginRight: 10
              }}
            />
          )}
          {navItem.name}
        </div>
      )
      const item = navItem.icon ? (
        <Icon
          size="large"
          name={navItem.icon}
          style={{ margin: '0 auto' }}
        />
      ) : (
        <Image
          src={navItem.image}
          style={{
            width: 24,
            margin: '0 auto'
          }}
        />
      )
      const value = isMobile ? mobileItem : item
      const delay = i * 0.05 + 0.075
      const style = {
        opacity: this.props.opacity || 1,
        padding: 0,
        transition: 'opacity .5s',
        transitionDelay: `${delay}s`
      }
      return (
        <li key={i} style={style}>
          {navItem.uri === '/apps' ? <hr /> : ''}
          <NavLink
            onClick={this.props.onClick}
            to={navItem.uri}
            name={navItem.name}
            value={value}
          />
        </li>
      )
    })
  }
}

SideNav.propTypes = {
  onClick: PropTypes.func,
  width: PropTypes.string,
  opacity: PropTypes.number
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(SideNav)
