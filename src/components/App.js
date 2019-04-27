import React from 'react'
import URL from 'url'
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

export const contentMinHeight = 600

const Router = window.cordova ? HashRouter : BrowserRouter

const routeStyle = {
  minHeight: contentMinHeight
}

class App extends React.Component {
  handleWindowMessage = event => {
    if (event.data && event.data.action) {
      const actionFunctionName = event.data.action
      let params
      try {
        params = event.data.payload ? JSON.parse(event.data.payload) : null
      } catch (err) {
        console.error(`Invalid action: ${actionFunctionName}('${event.data.payload}')`)
        return
      }
      if (!this.props[actionFunctionName]) {
        console.error(`Invalid action '${actionFunctionName}'`)
        return
      }
      const { hostname } = URL.parse(event.origin)
      const ok = window.confirm(`Allow ${hostname} to call ${actionFunctionName}?`)
      if (!ok) return
      const response = this.props[actionFunctionName](params)
      // TODO: ability to call async functions
      window.parent.postMessage({
        rpcId: event.data.rpcId,
        response
      }, '*')
    }
  }

  addListenerOnce() {
    if (this.listener) return
    this.listener = true
    window.addEventListener('message', this.handleWindowMessage, false)
  }

  componentDidMount() {
    this.addListenerOnce()
    this.throttleWindowChange()
    this.resizeTimer = null
    window.addEventListener('resize', this.throttleWindowChange)

    this.props.fetchBinanceBalances()
    this.props.fetchWalletBalances()
  }

  throttleWindowChange = () => {
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => this.onResize(), 100)
  }

  onResize() {
    const width = document.body.clientWidth
    const isMobile = (width <= 765)
    const isTablet = (width > 765 && width < 1165)
    const isDesktop = (width >= 1165)
    const device = {
      isMobile,
      isTablet,
      isDesktop,
      width,
      deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    }
    this.props.setDevice(device)
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
        <div>
          <Header />
          <div style={{ borderBottom: border }}>
            {isMobile ? null : <SideNav />}
            <main style={mainStyle}>
              <div style={routeStyle}>
                <Route exact path="/" component={withTracker(Portfolio)} />
                <Route exact path="/ledger" component={withTracker(Ledger)} />
                <Route exact path="/trezor" component={withTracker(Trezor)} />
                <Route exact path="/binance" component={withTracker(Binance)} />
                <Route exact path="/settings" component={withTracker(Settings)} />
                <Route exact path="/apps" component={withTracker(ExternalApps)} />
                <Route exact path="/apps/:appId" component={withTracker(Iframe)} />
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.ephemeral.isMobile,
  lastBinanceSync: state.binance.lastSync
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
