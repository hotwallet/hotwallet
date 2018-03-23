import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import Counter from './Counter'
import Portfolio from './Portfolio'
import Settings from './Settings'
import Header from './Header'
import SideNav from './SideNav'
import 'semantic-ui-css/semantic.min.css'
import { sidebarWidth, border } from '../lib/styles'

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>
          <SideNav />
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

const mainStyle = {
  marginLeft: sidebarWidth,
  maxWidth: 1100,
  borderRight: border
}

const mapStateToProps = state => ({
  uri: state.router.location.pathname
})

export default connect(mapStateToProps)(App)
