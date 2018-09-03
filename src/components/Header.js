import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Image } from 'semantic-ui-react'
import { darkBg, sidebarWidth, border } from '../lib/styles'
import CurrencyContainer from '../containers/CurrencyContainer'
import MobileMenu from './MobileMenu'

class Header extends React.Component {
  state = { visible: false }

  openMenu = () => {
    this.setState({ visible: true })
  }

  closeMenu = () => {
    this.setState({ visible: false })
  }

  render() {
    const isMobile = this.props.isMobile
    const logoStyle = {
      width: isMobile ? 50 : sidebarWidth,
      display: 'inline-block',
      color: '#fff',
      borderRight: border
    }
    return (
      <div>
        {isMobile ? (
          <MobileMenu
            visible={this.state.visible}
            closeMenu={this.closeMenu}
          />
        ) : ''}
        <header style={headerStyle}>
          {isMobile ? (
            <Icon
              name="bars"
              size="large"
              inverted
              style={logoStyle}
              onClick={this.openMenu}
            />
          ) : (
            <Link to="/">
              <Image
                src="/hotwallet-144x144.png"
                style={{ ...logoStyle, width: 55, padding: '0 15px' }}
              />
            </Link>
          )}
          <div style={currencySelectorStyle}>
            <CurrencyContainer />
          </div>
        </header>
      </div>
    )
  }
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

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(Header)
