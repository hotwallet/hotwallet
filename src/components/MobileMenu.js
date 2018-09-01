import React from 'react'
import { connect } from 'react-redux'
import SideNav from './SideNav'
import { darkBg } from '../lib/styles'

const overlayStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: 1200,
  transition: 'top .2s, left .2s'
}

const menuStyle = {
  backgroundColor: darkBg,
  position: 'relative',
  width: '65%',
  height: '100%',
  transition: 'height .2s, width .2s',
  overflow: 'hidden',
  top: 5,
  left: 5,
  boxShadow: '8px 8px 8px rgba(0, 0, 0, .2)'
}

class MobileMenu extends React.Component {
  state = { isHover: false }

  onClickOverlay = () => {
    if (this.state.isHover) return
    this.props.closeMenu()
  }

  onMouseEnter = () => {
    this.setState({ isHover: true })
  }

  onTouchMove = () => {
    this.props.closeMenu()
  }

  onMouseLeave = () => {
    this.setState({ isHover: false })
  }

  render() {
    const isVisible = this.props.visible
    const height = isVisible ? '100%' : 0
    const width = isVisible ? '65%' : 0
    const top = isVisible ? 0 : -2000
    const left = isVisible ? 0 : -2000
    const opacity = isVisible ? 1 : 0.05
    return (
      <div
        style={{ ...overlayStyle, top, left }}
        onClick={this.onClickOverlay}
        onTouchMove={this.onTouchMove}
      >
        <div
          id="mobile-menu"
          style={{ ...menuStyle, width, height }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <SideNav
            onClick={this.props.closeMenu}
            width="100%"
            opacity={opacity}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(MobileMenu)
