import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'
import { PropTypes } from 'prop-types'

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
    if (props.uri === props.to) linkStyle = activeStyle
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
        horizontalOffset={-15}
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
  value: PropTypes.element.isRequired
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  uri: state.router.location.pathname
})

export default connect(mapStateToProps)(NavLink)
