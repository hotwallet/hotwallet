import React from 'react'
import { connect } from 'react-redux'
import { border, smallFontSize, mobilePadding, desktopPadding } from '../lib/styles'

class Footer extends React.Component {
  render() {
    const isMobile = this.props.isMobile
    const footerStyle = {
      marginTop: 50,
      borderTop: border,
      fontSize: smallFontSize,
      color: 'gray',
      padding: isMobile ? mobilePadding : desktopPadding
    }
    return (
      <footer style={footerStyle}>
        &copy; 2018 Gadget Labs
      </footer>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(Footer)
