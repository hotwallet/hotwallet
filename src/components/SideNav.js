import React from 'react'
import { connect } from 'react-redux'
import NavLink from './NavLink'
import { Icon, Image } from 'semantic-ui-react'
import { sidebarWidth } from '../lib/styles'

const navItems = [
  { icon: 'home', uri: '/', name: 'Portfolio' },
  { image: 'https://chnnl.imgix.net/tarragon/hardware/64x64/ledger.png', uri: '/ledger', name: 'Ledger Connect' },
  { image: 'https://chnnl.imgix.net/tarragon/exchanges/64x64/binance.png', uri: '/binance', name: 'Binance Connect' },
  { icon: 'setting', uri: '/settings', name: 'Settings' }
]

const ulStyle = {
  position: 'absolute',
  height: '100%',
  margin: 0,
  padding: 0,
  listStyleType: 'none'
}

class SideNav extends React.Component {
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
        <Icon size="large" name={navItem.icon} />
      ) : (
        <Image src={navItem.image} />
      )
      const value = isMobile ? mobileItem : item
      const delay = i * 0.05 + 0.075
      const style = {
        opacity: this.props.opacity || 1,
        padding: '5px 0',
        transition: 'opacity .5s',
        transitionDelay: `${delay}s`
      }
      return (
        <li key={i} style={style}>
          <NavLink
            to={navItem.uri}
            name={navItem.name}
            value={value}
            onClick={this.props.onClick}
          />
        </li>
      )
    })
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(SideNav)
