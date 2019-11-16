import React from 'react'
import { Icon } from 'semantic-ui-react'
import { border, mobilePadding, desktopPadding } from '../lib/styles'
import packageJson from '../../package.json'
import { withTheme } from '../contexts/theme'

class Footer extends React.PureComponent {
  render() {
    const isMobile = this.props.isMobile
    const footerStyle = {
      borderTop: border,
      color: 'gray',
      padding: isMobile ? mobilePadding : desktopPadding
    }
    const aStyle = {
      color: '#fff',
      display: isMobile ? 'block' : 'inline',
      marginTop: isMobile ? 10 : 0
    }
    const divider = (
      <span style={{
        margin: '0 15px',
        display: isMobile ? 'none' : 'inline'
      }}>|</span>
    )
    return (
      <footer style={footerStyle}>
        &copy; 2018 Gadget Labs
        {divider}
        {packageJson.version}
        {divider}
        <a href="https://github.com/hotwallet" style={aStyle}>
          <Icon
            name="github"
            inverted
          />
          GitHub
        </a>
        {divider}
        <a href="https://t.me/hotwalletapp" style={aStyle}>
          <Icon
            name="telegram plane"
            inverted
          />
          Telegram
        </a>
        {divider}
        <a href="https://www.producthunt.com/posts/hotwallet" style={aStyle}>
          <Icon
            name="product hunt"
            inverted
          />
          Product Hunt
        </a>
      </footer>
    )
  }
}

export default withTheme(Footer)
