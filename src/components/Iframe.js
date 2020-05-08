import React, { useState, useEffect, useRef } from 'react'
import { contentMinHeight } from './App'
import { Icon } from 'semantic-ui-react'
import { darkBg } from '../lib/styles'

const isLocalAppDev = false

function Iframe({ match }) {
  const [appId] = useState(match.params.appId)
  const [height, setHeight] = useState(contentMinHeight)
  const [listener, setListener] = useState(false)
  const loader = useRef(null)
  const iframe = useRef(null)

  const handleWindowMessage = event => {
    if (event.data.height) {
      const height = event.data.height || contentMinHeight
      return setHeight(height)
    }
    if (event.data.action) {
      const actionFunctionName = event.data.action
      // TODO: check if this.appId has permission to perform this action
      iframe.contentWindow.postMessage({
        rpcId: event.data.rpcId,
        response: [actionFunctionName](event.data.payload)
      }, '*')
    }
  }

  const addListenerOnce = () => {
    if (listener) return
    setListener(true)
    window.addEventListener('message', handleWindowMessage, false)
  }

  useEffect(() => {
    addListenerOnce()
    // TODO: show spinner when iframe is loading
    iframe.addEventListener('load', () => {
      iframe.style.visibility = 'visible'
      loader.style.display = 'none'
    })
    return () => {
      window.removeEventListener('message', handleWindowMessage, false)
    }
  }, [])

  if (!appId) return
  const iframeHeight = Math.max(contentMinHeight, height)
  return (
    <div>
      <div
        ref={loader}
        style={{
          width: '100%',
          paddingTop: 200,
          textAlign: 'center'
        }}
      >
        <Icon loading name="asterisk" size="massive" style={{ color: darkBg }} />
      </div>
      <iframe
        sandbox="allow-scripts allow-forms allow-popups"
        ref={iframe}
        style={{
          visibility: 'hidden',
          border: 'none',
          margin: 0,
          padding: 0,
          backgroundColor: 'transparent'
        }}
        width="100%"
        height={iframeHeight}
        title={appId}
        src={
          isLocalAppDev
            ? 'http://localhost:4000'
            : `https://hotwallet.github.io/hotwallet-app-${appId}`
        }
        allowtransparency="true"
      />
    </div>
  )
}

export default Iframe
