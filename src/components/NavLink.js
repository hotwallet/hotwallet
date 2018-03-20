import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { lightBlue } from '../lib/styles'

class NavLink extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hover: false }
  }

  render() {
    const props = this.props
    let linkStyle = {}
    if (this.state.hover) linkStyle = hoverStyle
    if (props.uri === props.to) linkStyle = activeStyle
    const style = { ...props.style, ...normalStyle, ...linkStyle }
    return (
      <Link style={style}
        to={props.to}
        onMouseOver={() => this.mouseOver()}
        onMouseOut={() => this.mouseOut()}>
        {props.name}
      </Link>
    )
  }

  mouseOver() {
    this.setState({ hover: true })
  }

  mouseOut() {
    this.setState({ hover: false })
  }
}

const highlightColor = '#282f36'

const normalStyle = {
  padding: '15px 20px',
  display: 'block',
  color: lightBlue
}

const hoverStyle = {
  backgroundColor: highlightColor
}

const activeStyle = {
  backgroundColor: highlightColor,
  color: '#fff'
}

const mapStateToProps = state => ({
  uri: state.router.location.pathname
})

export default connect(mapStateToProps)(NavLink)
