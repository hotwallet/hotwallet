import React from 'react'
import { connect } from 'react-redux'
import { darkBg, sidebarWidth } from '../lib/styles'
import CurrencySelector from './CurrencySelector'

class Header extends React.Component {
  render() {
    return (
      <header style={headerStyle}>
        <div style={logoStyle}>Tarragon</div>
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
  width: sidebarWidth - 20,
  display: 'inline-block',
  marginLeft: 20,
  color: '#999'
}

const mapStateToProps = state => ({
  user: {}
})

export default connect(mapStateToProps)(Header)
