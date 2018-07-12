import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { darkBg, sidebarWidth, border } from '../lib/styles'
import CurrencyContainer from '../containers/CurrencyContainer'
import NotificationsContainer from '../containers/NotificationsContainer'

class Header extends React.Component {
  render() {
    const isMobile = this.props.isMobile
    const logoStyle = {
      width: isMobile ? 50 : sidebarWidth,
      display: 'inline-block',
      color: 'gray',
      borderRight: border
    }
    return (
      <header style={headerStyle}>
        <Icon name="bars" size="large" inverted style={logoStyle} />
        <div style={currencySelectorStyle}>
          <CurrencyContainer />
        </div>
        <div style={notificationsStyle}>
          <NotificationsContainer />
        </div>
      </header>
    )
  }
}

const notificationsStyle = {
  display: 'inline-block'
}

const currencySelectorStyle = {
  marginLeft: 5,
  display: 'inline-block',
  borderRight: border,
  paddingRight: 25,
  marginRight: 25

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
