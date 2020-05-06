import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'
import { PropTypes } from 'prop-types'
import getPathName from '../lib/getPathName'
import { withTheme, compose } from '../contexts'

function NavLink({ isMobile, location, to, style, onClick, value, name }) {
  const [hover, setHover] = useState(false)
  const [showTooltip, setTooltip] = useState(false)

  let linkStyle = {}
  const activeStyle = {
    backgroundColor: isMobile ? null : highlightColor
  }
  const normalStyle = {
    padding: isMobile ? 10 : 15,
    display: 'block',
    color: '#fff'
  }
  if (hover) linkStyle = hoverStyle
  if (getPathName(location) === to) linkStyle = activeStyle
  const allStyles = { ...style, ...normalStyle, ...linkStyle }
  const link = (
    <Link style={allStyles}
      to={to}
      onClick={() => {
        if (onClick) onClick()
        setTooltip(false)
      }}
      onMouseOver={() => setHover(true) & setTooltip(true)}
      onMouseOut={() => setHover(false) & setTooltip(false)}
    >{value}</Link>
  )
  if (isMobile) {
    return link
  }
  return (
    <Popup
      inverted
      open={showTooltip}
      size="tiny"
      horizontalOffset={-5}
      trigger={link}
      content={name}
      position="right center"
    />
  )
}

const highlightColor = '#282f36'

const hoverStyle = {
  backgroundColor: highlightColor
}

NavLink.propTypes = {
  onClick: PropTypes.func,
  to: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.element.isRequired,
  location: PropTypes.object.isRequired
}

export default compose(
  withRouter,
  withTheme
)(NavLink)
