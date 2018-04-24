// based on https://github.com/react-ga/react-ga/issues/122#issuecomment-299692833

import React from 'react'
import GoogleAnalytics from 'react-ga'
import * as config from '../config'

GoogleAnalytics.initialize(config.ga.trackingID)

let lastPage

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    GoogleAnalytics.set({
      page,
      ...options
    })
    GoogleAnalytics.pageview(page)
  }

  const HOC = class extends React.Component {
    componentDidMount() {
      const page = this.props.location.pathname

      // component may be mounted twice on initial load
      if (page !== lastPage) {
        trackPage(page)
      }

      lastPage = page
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  return HOC
}

export default withTracker
