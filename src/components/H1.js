import React from 'react'
import { connect } from 'react-redux'
import { mobilePadding, desktopPadding } from '../lib/styles'

class H1 extends React.Component {
  render() {
    const isMobile = this.props.isMobile
    const style = {
      padding: isMobile ? mobilePadding : desktopPadding
    }
    return (
      <h1 style={style}>{this.props.text}</h1>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(H1)
