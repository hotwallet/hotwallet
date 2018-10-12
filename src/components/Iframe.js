import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { contentMinHeight } from './App'

class Iframe extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      appId: props.match.params.appId,
      height: 0
    }
  }

  render() {
    const height = Math.max(contentMinHeight, this.state.height)
    return (
      <iframe
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
        onLoad={() => {
          const obj = ReactDOM.findDOMNode(this)
          this.setState({
            height: obj.contentWindow.document.body.scrollHeight
          })
        }}
      ></iframe>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Iframe)
