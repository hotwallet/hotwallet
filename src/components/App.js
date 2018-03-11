import React from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import Counter from './Counter'
import Portfolio from './Portfolio'
import Settings from './Settings'
import HeaderBar from './Header'
import 'semantic-ui-css/semantic.min.css'

const navItems = {
  Portfolio: '/',
  Counter: '/counter',
  Settings: '/settings'
}

class App extends React.Component {
  render() {
    const activeUri = this.props.uri
    const rows = Object.keys(navItems).map((name, i) => {
      const uri = navItems[name]
      const linkStyle = (activeUri === uri) ? activeStyle : inactiveStyle
      return (
        <li key={i}>
          <Link style={linkStyle} to={uri}>
            {name}
          </Link>
        </li>
      )
    })
    return (
      <div>
        <HeaderBar />
        <div>
          <style>{`.nav li:hover{background-color:#282f36}`}</style>
          <ul className="nav" style={ulStyle}>
            {rows}
          </ul>
          <main style={mainStyle}>
            <Route exact path="/" component={Portfolio} />
            <Route exact path="/counter" component={Counter} />
            <Route exact path="/settings" component={Settings} />
          </main>
        </div>
      </div>
    )
  }
}

const sideBarWidth = 175

const ulStyle = {
  position: 'fixed',
  width: sideBarWidth,
  borderRight: '1px solid #49525a',
  height: '100%',
  margin: 0,
  padding: 0,
  listStyleType: 'none'
}

const inactiveStyle = {
  padding: '15px 20px',
  display: 'block'
}

const activeStyle = Object.assign({
  backgroundColor: '#282f36',
  color: '#fff'
}, inactiveStyle)

const mainStyle = {
  marginLeft: sideBarWidth
}

const mapStateToProps = state => ({
  uri: state.router.location.pathname
})

export default connect(mapStateToProps)(App)
