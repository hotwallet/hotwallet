import React from 'react'
import { PropTypes } from 'prop-types'
import { withTheme } from '../contexts'
import { mobilePadding, desktopPadding, border } from '../lib/styles'

function H1({ isMobile, text, subtitle }) {
  const div = {
    padding: isMobile ? mobilePadding : desktopPadding,
    borderBottom: border
  }
  const h1 = {
    fontSize: 21,
    margin: 0,
    fontWeight: 100
  }
  const h5 = {
    fontSize: 13,
    margin: '5px 0 0',
    fontWeight: 100,
    color: '#999'
  }
  return (
    <div style={div}>
      <h1 style={h1}>{text}</h1>
      {subtitle ? <h5 style={h5}>{subtitle}</h5> : ''}
    </div>
  )
}

H1.propTypes = {
  text: PropTypes.string.isRequired,
  subtitle: PropTypes.string
}

export default withTheme(H1)
