import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { darkBg, sidebarWidth, border } from '../lib/styles'
import CurrencySelector from './CurrencySelector'

class Header extends React.Component {
  render() {
    return (
      <header style={headerStyle}>
        <Icon name="bars" size="large" inverted style={logoStyle} />
        <div style={currencySelectorStyle}>
          <CurrencySelector />
        </div>
      </header>
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

const logoStyle = {
  width: sidebarWidth,
  display: 'inline-block',
  color: 'gray',
  borderRight: border
}

const mapStateToProps = state => ({
  user: {}
})

export default connect(mapStateToProps)(Header)
