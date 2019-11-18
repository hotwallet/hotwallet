import React from 'react'
import { connect } from 'react-redux'
import { Route, BrowserRouter, HashRouter } from 'react-router-dom'
import Portfolio from './Portfolio'
import Ledger from './Ledger'
import Trezor from './Trezor'
import Binance from './Binance'
import Settings from './Settings'
import Iframe from './Iframe'
import ExternalApps from './ExternalApps'
import Header from './Header'
import Footer from './Footer'
import SideNav from './SideNav'
import '../lib/addToHomeScreen'
import 'semantic-ui-css/semantic.min.css'
import { sidebarWidth, border, appMaxWidth } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import withTracker from './withTracker'
import { assetService } from '../services'
import { withTheme, compose } from '../contexts'

export const contentMinHeight = 600

const Router = window.cordova ? HashRouter : BrowserRouter

const routeStyle = {
  minHeight: contentMinHeight
}

class App extends React.Component {
  componentDidMount() {
    this.props.fetchBinanceBalances()
    this.props.fetchWalletBalances()
    assetService.importAssets().catch(console.log)
  }

  render() {
    const isMobile = this.props.isMobile
    const mainStyle = {
      marginLeft: isMobile ? 0 : sidebarWidth,
      maxWidth: appMaxWidth,
      borderLeft: isMobile ? 'none' : border
    }
    return (
      <Router>
        <>
          <Header />
          <div style={{ borderBottom: border }}>
            {isMobile ? null : <SideNav />}
            <main style={mainStyle}>
              <div style={routeStyle}>
                <Route exact path="/" component={withTracker(Portfolio)} />
                <Route exact path="/ledger" component={withTracker(Ledger)} />
                <Route exact path="/trezor" component={withTracker(Trezor)} />
                <Route exact path="/binance" component={withTracker(Binance)} />
                <Route exact path="/settings" component={(Settings)} />
                <Route exact path="/apps" component={withTracker(ExternalApps)} />
                <Route exact path="/apps/:appId" component={withTracker(Iframe)} />
              </div>
              <Footer />
            </main>
          </div>
        </>
      </Router>
    )
  }
}

export default compose(
  withTheme,
  connect(null, mapDispatchToProps)
)(App)
