import React from 'react'
import { connect } from 'react-redux'
import { contentMinHeight } from './App'
import { mapDispatchToProps } from '../actions'
import { Icon } from 'semantic-ui-react'
import { darkBg } from '../lib/styles'

class Iframe extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      appId: props.match.params.appId,
      height: contentMinHeight
    }
  }

  handleWindowMessage = event => {
    if (event.data.height) {
      const height = event.data.height || contentMinHeight
      return this.setState({ height })
    }
    if (event.data.action) {
      const actionFunctionName = event.data.action
      // TODO: check if this.appId has permission to perform this action
      this.iframe.contentWindow.postMessage({
        rpcId: event.data.rpcId,
        response: this.props[actionFunctionName](event.data.payload)
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
    // TODO: show spinner when iframe is loading
    this.iframe.addEventListener('load', () => {
      this.iframe.style.visibility = 'visible'
      this.loader.style.display = 'none'
    })
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWindowMessage, false)
  }

  render() {
    if (!this.state.appId) return
    const height = Math.max(contentMinHeight, this.state.height)
    return (
      <div>
        <div
          ref={l => { this.loader = l }}
          style={{
            width: '100%',
            paddingTop: 200,
            textAlign: 'center'
          }}
        >
          <Icon loading name="asterisk" size="massive" style={{ color: darkBg }} />
        </div>
        <iframe
          sandbox="allow-scripts allow-forms"
          ref={f => { this.iframe = f }}
          style={{
            visibility: 'hidden',
            border: 'none',
            margin: 0,
            padding: 0,
            backgroundColor: 'transparent'
          }}
          width="100%"
          height={height}
          title={this.state.appId}
          src={
            // 'http://localhost:4000'
            `https://hotwallet.github.io/hotwallet-app-${this.state.appId}`
          }
          allowtransparency="true"
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Iframe)
