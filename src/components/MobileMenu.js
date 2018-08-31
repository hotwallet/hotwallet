import React from 'react'
import { connect } from 'react-redux'
import SideNav from './SideNav'
import { darkBg } from '../lib/styles'

const overlayStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: 1200
}

const menuStyle = {
  backgroundColor: darkBg,
  position: 'relative',
  width: '65%',
  height: '100%',
  transition: 'max-height .25s',
  overflow: 'hidden',
  top: 8,
  left: 8,
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
    const maxHeight = isVisible ? '100%' : 0
    const left = isVisible ? 0 : -1000
    return (
      <div
        style={{ ...overlayStyle, left }}
        onClick={this.onClickOverlay}
        onTouchMove={this.onTouchMove}
      >
        <div
          id="menu"
          style={{ ...menuStyle, maxHeight }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <SideNav
            onClick={this.props.closeMenu}
            width="100%"
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
