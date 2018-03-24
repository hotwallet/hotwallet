import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'
import CurrencyIcon from './CurrencyIcon'

class CurrencyButton extends React.Component {
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

const mapStateToProps = state => ({
  baseCurrency: state.user.baseCurrency
})

export default connect(mapStateToProps)(CurrencyButton)
