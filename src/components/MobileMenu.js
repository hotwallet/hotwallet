import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import SideNav from './SideNav'
import { darkBg } from '../lib/styles'

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

class MobileMenu extends React.PureComponent {
  state = { isHover: false }

  onClickOverlay = () => {
    if (this.state.isHover) return
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
    const isLeftSwipe = x > 0 && x > Math.abs(y)
    if (!isLeftSwipe) return
    this.props.closeMenu()
  }

  onMouseLeave = () => {
    this.setState({ isHover: false })
  }

  render() {
    const isVisible = this.props.visible
    const height = isVisible ? menuStyle.height : 0
    const width = isVisible ? menuStyle.width : 0
    const top = isVisible ? 0 : -2000
    const left = isVisible ? 0 : -2000
    const opacity = isVisible ? 1 : 0.01
    return (
      <div
        style={{ ...overlayStyle, top, left }}
        onClick={this.onClickOverlay}
        onTouchStart={this.onTouchStart}
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

MobileMenu.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeMenu: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(MobileMenu)
