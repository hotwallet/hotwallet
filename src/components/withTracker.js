// based on https://github.com/react-ga/react-ga/issues/122#issuecomment-299692833

import React, { useEffect } from 'react'
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

  function HOC({ location }) {
    useEffect(() => {
      const page = location.pathname

      // component may be mounted twice on initial load
      if (page !== lastPage) {
        trackPage(page)
      }

      lastPage = page
    }, [])

    useEffect(() => trackPage(location.pathname), [location.pathname])

    return <WrappedComponent location={location} />
  }

  return HOC
}

export default withTracker
