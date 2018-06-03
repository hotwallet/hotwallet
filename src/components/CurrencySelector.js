import React from 'react'
import '../lib/currency-flags.min.css'
import CurrencyButton from './CurrencyButton'
import CurrencyPopup from './CurrencyPopup'
import PropTypes from 'prop-types'

class CurrencySelector extends React.PureComponent {
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
          active={this.state.active}
          onClick={() => this.setState({ active: false })}
          currencies={this.props.currencies}
          baseCurrency={this.props.baseCurrency}
          setBaseCurrency={this.props.setBaseCurrency}
        />
        <CurrencyButton
          currency={baseCurrency}
          caret
          onClick={() => this.setState({ active: !this.state.active })}
          setBaseCurrency={this.props.setBaseCurrency}
        />
      </div>
    )
  }
}

CurrencySelector.propTypes = {
  baseCurrency: PropTypes.string.isRequired,
  setBaseCurrency: PropTypes.func.isRequired,
  currencies: PropTypes.array.isRequired
}

export default CurrencySelector
