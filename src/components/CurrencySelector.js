import React from 'react'
import { connect } from 'react-redux'
import '../lib/currency-flags.min.css'
import CurrencyButton from './CurrencyButton'
import CurrencyPopup from './CurrencyPopup'

class CurrencySelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  }

  render() {
    const baseCurrency = this.props.baseCurrency
    return (
      <div>
        <CurrencyPopup
          style={{display: this.state.active ? 'block' : 'none'}}
          onClick={() => this.setState({ active: false })}
        />
        <CurrencyButton
          currency={baseCurrency}
          caret
          onClick={() => this.setState({ active: !this.state.active })}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  baseCurrency: state.user.baseCurrency
})

export default connect(mapStateToProps)(CurrencySelector)
