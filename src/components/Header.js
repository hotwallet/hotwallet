import React from 'react'
import { connect } from 'react-redux'
import { darkBg } from '../lib/styles'

class Header extends React.Component {
  render() {
    return (
      <header style={headerStyle}>
        <span>Tarragon</span>
      </header>
    )
  }
}

const headerStyle = {
  backgroundColor: darkBg,
  padding: '15px 20px',
  textTransform: 'uppercase'
}

const mapStateToProps = state => ({
  user: {}
})

export default connect(mapStateToProps)(Header)
