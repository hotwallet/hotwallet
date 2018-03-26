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
    const isMobile = (width <= 775)
    const isTablet = (width > 775 && width < 1165)
    const isDesktop = (width >= 1165)
    this.props.setDevice({
      isMobile,
      isTablet,
      isDesktop,
      width,
      deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    })
  }

  isMobile() {
    return this.props.isMobile
  }

  render() {
    const mainStyle = {
      marginLeft: this.isMobile() ? 0 : sidebarWidth,
      maxWidth: 1100,
      borderLeft: border
    }
    return (
      <div>
        <Header />
        <div>
          {this.isMobile() ? null : <SideNav />}
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
  minHeight: 300
}

const mapStateToProps = state => ({
  uri: state.router.location.pathname,
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
