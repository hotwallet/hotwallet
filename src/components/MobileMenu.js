import React, { useState } from 'react'
import { PropTypes } from 'prop-types'
import SideNav from './SideNav'
import { darkBg } from '../lib/styles'
import { withTheme } from '../contexts'

const overlayStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: 1200,
  transition: 'top .1s, left .1s'
}

const menuStyle = {
  backgroundColor: darkBg,
  position: 'relative',
  width: 250,
  height: 500,
  transition: 'height .1s, width .1s',
  overflow: 'hidden',
  top: 5,
  left: 5,
  boxShadow: '8px 8px 8px rgba(0, 0, 0, .2)'
}

function MobileMenu({ closeMenu, visible }) {
  const [isHover, setHover] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const onClickOverlay = () => {
    if (isHover) return
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
    const isLeftSwipe = x > 0 && x > Math.abs(y)
    if (!isLeftSwipe) return
    closeMenu()
  }

  const onMouseLeave = () => {
    setHover(false)
  }

  const height = visible ? menuStyle.height : 0
  const width = visible ? menuStyle.width : 0
  const top = visible ? 0 : -2000
  const left = visible ? 0 : -2000
  const opacity = visible ? 1 : 0.01
  return (
    <div
      style={{ ...overlayStyle, top, left }}
      onClick={onClickOverlay}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
    >
      <div
        id="mobile-menu"
        style={{ ...menuStyle, width, height }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <SideNav
          onClick={closeMenu}
          width="100%"
          opacity={opacity}
        />
      </div>
    </div>
  )
}

MobileMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired
}

export default withTheme(MobileMenu)
