import React from 'react'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { mobilePadding, desktopPadding, border } from '../lib/styles'

class H1 extends React.PureComponent {
  render() {
    const { isMobile, text, subtitle, image, content } = this.props
    const div = {
      padding: isMobile ? mobilePadding : desktopPadding,
      paddingRight: 15,
      borderBottom: border
    }
    const h1 = {
      fontSize: 21,
      margin: 0,
      fontWeight: 100,
      display: 'inline',
      verticalAlign: 'middle'
    }
    const h5 = {
      fontSize: 13,
      margin: '5px 0 0',
      fontWeight: 100,
      color: '#999'
    }
    return (
      <div style={div}>
        {image || ''}
        <h1 style={h1}>{text}</h1>
        {subtitle ? <h5 style={h5}>{subtitle}</h5> : ''}
        {content || ''}
      </div>
    )
  }
}

H1.propTypes = {
  text: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  content: PropTypes.object
}

const mapStateToProps = state => ({
  isMobile: state.ephemeral.isMobile
})

export default connect(mapStateToProps)(H1)
