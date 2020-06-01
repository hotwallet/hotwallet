import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
import { Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { darkBg } from '../lib/styles'
import { withTheme, compose } from '../contexts'

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
    name: 'Chat with Us',
    uri: 'https://t.me/hotwalletapp',
    icon: 'telegram plane'
  },
  {
    name: '@hotwallet',
    uri: 'https://github.com/hotwallet',
    icon: 'github'
  },
  {
    name: 'Apps API',
    uri: 'https://github.com/hotwallet/hotwallet/wiki/HotWallet-Apps-API',
    icon: 'cubes'
  }
]

function SettingsMenu({ closeMenu, onClickOverlay, maxWidth, visible }) {
  const [, setHover] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const windowWidth = window.innerWidth

  const onClickOverlaySettingsMenu = () => {
    closeMenu()
  }

  const onMouseEnter = () => {
    setHover(true)
  }

  const onTouchStart = e => {
    setStartX(e.touches[0].pageX)
    setStartY(e.touches[0].pageY)
  }

  const onTouchMove = e => {
    const x = startX - e.touches[0].pageX
    const y = startY - e.touches[0].pageY
    const isRightSwipe = x < 0 && Math.abs(x) > Math.abs(y)
    if (!isRightSwipe) return
    closeMenu()
  }

  const onMouseLeave = () => {
    setHover(false)
  }

  const getNavLinks = () => {
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
          onClick={onClickOverlay}
        >{item}</a>
      ) : (
        <Link
          key={i}
          style={style}
          to={navItem.uri}
          onClick={onClickOverlay}
        >{item}</Link>
      )
    })
  }

  const height = visible ? menuStyle.height : 0
  const width = visible ? menuStyle.width : 0
  const top = visible ? 0 : -2000
  const right = windowWidth > maxWidth ? windowWidth - maxWidth : 0
  return (
    <div
      style={{ ...overlayStyle, top, right }}
      onClick={onClickOverlaySettingsMenu}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div
        id="settings-menu"
        style={{ ...menuStyle, width, height }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {getNavLinks()}
      </div>
    </div>
  )
}

SettingsMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired
}

export default compose(
  withTheme
)(SettingsMenu)
