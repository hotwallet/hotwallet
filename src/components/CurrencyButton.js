import React from 'react'
import { Icon } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'
import CurrencyIcon from './CurrencyIcon'
import { PropTypes } from 'prop-types'

class CurrencyButton extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      hover: false
    }
  }
  render() {
    const currency = this.props.currency
    let style = this.state.hover ? buttonStyleHover : buttonStyle
    return (
      <button
        style={style}
        onMouseOver={() => this.setState({ hover: true })}
        onMouseOut={() => this.setState({ hover: false })}
        onClick={this.props.onClick}
      >
        <CurrencyIcon currency={currency} style={{ display: 'inline-block' }} />
        <Icon
          name="caret down"
          style={{
            display: 'inline-block',
            visibility: this.props.caret ? 'visible' : 'hidden'
          }}
        />
      </button>
    )
  }
}

CurrencyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  caret: PropTypes.bool
}

const buttonStyle = {
  border: 'none',
  borderRadius: 4,
  padding: '8px 8px 8px 15px',
  outline: 'none'
}

const buttonStyleHover = {
  ...buttonStyle,
  backgroundColor: lightBg
}

export default CurrencyButton
