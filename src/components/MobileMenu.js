import React from 'react'
import { connect } from 'react-redux'
import SideNav from './SideNav'

const overlayStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  zIndex: 1200
}

const menuStyle = {
  backgroundColor: '#000',
  position: 'relative',
  width: '65%',
  height: '100%',
  transition: 'max-height .25s',
  overflow: 'hidden'
}

class MobileMenu extends React.Component {
  state = { isHover: false }

  onClickOverlay = () => {
    if (this.state.isHover) return
    this.props.toggleMenu()
  }

  onMouseEnter = () => {
    this.setState({ isHover: true })
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
      >
        <div
          id='menu'
          style={{ ...menuStyle, maxHeight }}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <SideNav
            onClick={this.props.toggleMenu}
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
