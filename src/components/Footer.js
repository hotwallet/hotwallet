import React from 'react'
import { connect } from 'react-redux'
import { border, smallFontSize } from '../lib/styles'

class Footer extends React.Component {
  render() {
    return (
      <footer style={footerStyle} className="pad">
        &copy; 2018 Gadget Labs
      </footer>
    )
  }
}

const footerStyle = {
  marginTop: 50,
  borderTop: border,
  fontSize: smallFontSize,
  color: 'gray'
}

const mapStateToProps = state => ({
  user: {}
})

export default connect(mapStateToProps)(Footer)
