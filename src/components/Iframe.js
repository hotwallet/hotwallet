import React from 'react'
import { connect } from 'react-redux'
import { contentMinHeight } from './App'

class Iframe extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      appId: props.match.params.appId,
      height: contentMinHeight
    }
  }

  handleWindowMessage = event => {
    if (!event.data.height) return
    const height = event.data.height || contentMinHeight
    this.setState({ height })
  }

  addListenerOnce() {
    if (this.listener) return
    this.listener = true
    window.addEventListener('message', this.handleWindowMessage, false)
  }

  componentDidMount() {
    this.addListenerOnce()
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWindowMessage, false)
  }

  render() {
    if (!this.state.appId) return
    const height = Math.max(contentMinHeight, this.state.height)
    return (
      <iframe
        sandbox="allow-scripts allow-forms"
        ref="iframe"
        style={{
          border: 'none',
          margin: 0,
          padding: 0
        }}
        width="100%"
        height={height}
        title={this.state.appId}
        src={`/iframe.html?${this.state.appId}`}
      />
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Iframe)
