import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Icon, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { darkBg, sidebarWidth, border, appMaxWidth } from '../lib/styles'
import CurrencyContainer from '../containers/CurrencyContainer'
import MobileMenu from './MobileMenu'
import SettingsMenu from './SettingsMenu'
import getPathName from '../lib/getPathName'
import { compose, withTheme } from '../contexts'

class Header extends React.PureComponent {
  state = {
    menuVisible: false,
    settingsMenuVisible: false
  }

  openMenu = () => this.setState({ menuVisible: true })

  closeMenu = () => this.setState({ menuVisible: false })

  openSettingsMenu = () => this.setState({ settingsMenuVisible: true })

  closeSettingsMenu = () => this.setState({ settingsMenuVisible: false })

  renderHamburger() {
    const isMobile = this.props.isMobile
    const logoStyle = {
      width: isMobile ? 50 : sidebarWidth,
      display: 'inline-block',
      color: '#fff',
      borderRight: border
    }
    if (!isMobile) {
      return <Link to="/">
        <Image
          src="/hotwallet-144x144.png"
          style={{ ...logoStyle, width: 55, padding: '0 15px' }}
        />
      </Link>
    }
    if (getPathName(this.props.location) === '/') {
      return <Icon
        name="bars"
        size="large"
        inverted
        style={logoStyle}
        onClick={this.openMenu}
      />
    }
    return <Link to="/">
      <Icon
        name="left arrow"
        size="large"
        inverted
        style={logoStyle}
      />
    </Link>
  }

  render() {
    const isMobile = this.props.isMobile
    return (
      <div style={{ maxWidth: isMobile ? '100%' : appMaxWidth + sidebarWidth }}>
        {isMobile ? (
          <MobileMenu
            visible={this.state.menuVisible}
            closeMenu={this.closeMenu}
          />
        ) : ''}
        <SettingsMenu
          maxWidth={appMaxWidth + sidebarWidth}
          visible={this.state.settingsMenuVisible}
          closeMenu={this.closeSettingsMenu}
        />
        <header style={headerStyle}>
          {this.renderHamburger()}
          <div style={currencySelectorStyle}>
            <CurrencyContainer />
          </div>
          <div
            style={{
              float: 'right',
              margin: '7px 20px',
              cursor: 'pointer'
            }}
            onClick={this.openSettingsMenu}
          >
            <Icon
              name="setting"
              size="large"
              inverted
            />
          </div>
        </header>
      </div>
    )
  }
}

Header.propTypes = {
  location: PropTypes.object.isRequired
}

const currencySelectorStyle = {
  marginLeft: 5,
  display: 'inline-block'
}

const headerStyle = {
  backgroundColor: darkBg,
  padding: '8px 0',
  textTransform: 'uppercase'
}

export default compose(
  withRouter,
  withTheme
)(Header)
