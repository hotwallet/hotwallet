import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import Portfolio from './Portfolio'
import Settings from './Settings'
import Header from './Header'
import Footer from './Footer'
import SideNav from './SideNav'
import 'semantic-ui-css/semantic.min.css'
import { sidebarWidth, border } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import { getProps } from '../selector'

class App extends React.Component {
  componentDidMount() {
    this.onResize()
    let resizeTimer
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        this.onResize()
      }, 100)
    })
  }

  onResize() {
    const width = window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    const isMobile = (width <= 765)
    const isTablet = (width > 765 && width < 1165)
    const isDesktop = (width >= 1165)
    this.props.setDevice({
      isMobile,
      isTablet,
      isDesktop,
      width,
      deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    })
  }

  render() {
    const isMobile = this.props.isMobile
    const mainStyle = {
      marginLeft: isMobile ? 0 : sidebarWidth,
      maxWidth: 1100,
      borderLeft: isMobile ? 'none' : border
    }
    return (
      <div>
        <Header />
        <div style={{ borderBottom: border }}>
          {isMobile ? null : <SideNav />}
          <main style={mainStyle}>
            <div style={routeStyle}>
              <Route exact path="/" component={Portfolio} />
              <Route exact path="/settings" component={Settings} />
            </div>
            <Footer />
          </main>
        </div>
      </div>
    )
  }
}

const routeStyle = {
  minHeight: 400
}

const mapStateToProps = getProps(selector => ({
  uri: selector.uri(),
  isMobile: selector.isMobile()
}))

export default connect(mapStateToProps, mapDispatchToProps)(App)
