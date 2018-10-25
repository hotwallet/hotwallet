import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'
import { PropTypes } from 'prop-types'
import getPathName from '../lib/getPathName'

class NavLink extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      showTooltip: false
    }
  }

  render() {
    const props = this.props
    const isMobile = props.isMobile
    let linkStyle = {}
    const activeStyle = {
      backgroundColor: isMobile ? null : highlightColor
    }
    const normalStyle = {
      padding: isMobile ? 10 : 15,
      display: 'block',
      color: '#fff'
    }
    if (this.state.hover) linkStyle = hoverStyle
    if (getPathName(props.location) === props.to) linkStyle = activeStyle
    const style = { ...props.style, ...normalStyle, ...linkStyle }
    const link = (
      <Link style={style}
        to={props.to}
        onClick={() => {
          if (props.onClick) props.onClick()
          this.setState({ showTooltip: false })
        }}
        onMouseOver={() => this.setState({ hover: true, showTooltip: true })}
        onMouseOut={() => this.setState({ hover: false, showTooltip: false })}
      >{props.value}</Link>
    )
    if (isMobile) {
      return link
    }
    return (
      <Popup
        inverted
        open={this.state.showTooltip}
        size="tiny"
        horizontalOffset={-5}
        trigger={link}
        content={props.name}
        position="right center"
      />
    )
  }

  mouseOver() {

  }

  mouseOut() {

  }
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

const mapStateToProps = state => ({
  isMobile: state.ephemeral.isMobile
})

export default withRouter(connect(mapStateToProps)(NavLink))
