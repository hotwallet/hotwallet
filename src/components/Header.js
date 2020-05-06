import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Icon, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { darkBg, sidebarWidth, border, appMaxWidth } from '../lib/styles'
import CurrencyContainer from '../containers/CurrencyContainer'
import MobileMenu from './MobileMenu'
import SettingsMenu from './SettingsMenu'
import getPathName from '../lib/getPathName'
import { withTheme, compose } from '../contexts'

function Header({ isMobile, location }) {
  const [menuVisible, setMenuVisible] = useState(false)
  const [settingsMenuVisible, setSettingsMenuVisible] = useState(false)

  const openMenu = () => setMenuVisible(true)

  const closeMenu = () => setMenuVisible(false)

  const openSettingsMenu = () => setSettingsMenuVisible(true)

  const closeSettingsMenu = () => setSettingsMenuVisible(false)

  const renderHamburger = () => {
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
    if (getPathName(location) === '/') {
      return <Icon
        name="bars"
        size="large"
        inverted
        style={logoStyle}
        onClick={openMenu}
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

  return (
    <div style={{ maxWidth: isMobile ? '100%' : appMaxWidth + sidebarWidth }}>
      {isMobile ? (
        <MobileMenu
          visible={menuVisible}
          closeMenu={closeMenu}
        />
      ) : ''}
      <SettingsMenu
        maxWidth={appMaxWidth + sidebarWidth}
        visible={settingsMenuVisible}
        closeMenu={closeSettingsMenu}
      />
      <header style={headerStyle}>
        {renderHamburger()}
        <div style={currencySelectorStyle}>
          <CurrencyContainer />
        </div>
        <div
          style={{
            float: 'right',
            margin: '7px 20px',
            cursor: 'pointer'
          }}
          onClick={openSettingsMenu}
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
