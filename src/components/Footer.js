import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { border, smallFontSize, mobilePadding, desktopPadding } from '../lib/styles'

class Footer extends React.PureComponent {
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
        <span style={{ margin: '0 15px' }}>|</span>
        <a href="https://github.com/hotwallet" style={{ color: '#fff' }}>
          <Icon
            name="github"
            inverted
          />
          HotWallet
        </a>
      </footer>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(Footer)
