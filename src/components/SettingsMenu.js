import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { darkBg } from '../lib/styles'

const overlayStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: 1200,
  transition: 'top .1s, right .1s'
}

const menuStyle = {
  backgroundColor: darkBg,
  position: 'absolute',
  width: 200,
  height: 350,
  transition: 'height .1s, width .1s',
  overflow: 'hidden',
  top: 5,
  right: 5,
  boxShadow: '8px 8px 8px rgba(0, 0, 0, .2)'
}

const navItems = [
  {
    name: 'Settings',
    uri: '/settings',
    icon: 'setting'
  },
  {
    name: 'Invite a Friend',
    uri: '/invite',
    icon: 'user plus'
  },
  {
    name: 'Chat with Us',
    uri: 'https://t.me/hotwalletapp',
    icon: 'telegram plane'
  },
  {
    name: 'Open Source',
    uri: 'https://github.com/hotwallet',
    icon: 'github'
  },
  {
    name: 'Developer API',
    uri: 'https://github.com/hotwallet/hotwallet/wiki/HotWallet-Developer-API',
    icon: 'cubes'
  }
]

class SettingsMenu extends React.PureComponent {
  state = { isHover: false }

  onClickOverlay = () => {
    this.props.closeMenu()
  }

  onMouseEnter = () => {
    this.setState({ isHover: true })
  }

  onTouchStart = e => {
    this.startX = e.touches[0].pageX
    this.startY = e.touches[0].pageY
  }

  onTouchMove = e => {
    const x = this.startX - e.touches[0].pageX
    const y = this.startY - e.touches[0].pageY
    const isRightSwipe = x < 0 && Math.abs(x) > Math.abs(y)
    if (!isRightSwipe) return
    this.props.closeMenu()
  }

  onMouseLeave = () => {
    this.setState({ isHover: false })
  }

  getNavLinks() {
    return navItems.map((navItem, i) => {
      const item = (
        <div>
          <Icon
            size="large"
            name={navItem.icon || 'setting'}
            style={{ marginRight: 10 }}
          />
          <span style={{ verticalAlign: 'middle' }}>{navItem.name}</span>
        </div>
      )
      const delay = i * 0.05 + 0.075
      const style = {
        color: '#fff',
        display: 'block',
        padding: '13px 18px 10px',
        transition: 'opacity .5s',
        transitionDelay: `${delay}s`
      }
      return navItem.uri.startsWith('http') ? (
        <a
          key={i}
          style={style}
          href={navItem.uri}
          onClick={this.props.onClickOverlay}
        >{item}</a>
      ) : (
        <Link
          key={i}
          style={style}
          to={navItem.uri}
          onClick={this.props.onClickOverlay}
        >{item}</Link>
      )
    })
  }

  render() {
    const isVisible = this.props.visible
    const height = isVisible ? menuStyle.height : 0
    const width = isVisible ? menuStyle.width : 0
    const top = isVisible ? 0 : -2000
    const right = isVisible ? 0 : -2000
    return (
      <div
        style={{ ...overlayStyle, top, right }}
        onClick={this.onClickOverlay}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
      >
        <div
          id="settings-menu"
          style={{ ...menuStyle, width, height }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          {this.getNavLinks()}
        </div>
      </div>
    )
  }
}

SettingsMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isMobile: state.ephemeral.isMobile
})

export default connect(mapStateToProps)(SettingsMenu)
