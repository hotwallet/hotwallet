import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import CurrencySelector from '../components/CurrencySelector'

const supportedCurrencies = [
  'USD', 'EUR', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK',
  'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN',
  'MYR', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'RUB', 'SEK', 'SGD', 'THB',
  'TRY', 'TWD', 'ZAR'
]

class CurrencyContainer extends React.Component {
  render() {
    return React.createElement(CurrencySelector, {
      baseCurrency: this.props.baseCurrency,
      setBaseCurrency: this.props.setBaseCurrency,
      currencies: supportedCurrencies
    })
  }
}

const mapStateToProps = (state, props) => ({
  baseCurrency: state.user.baseCurrency
})

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyContainer)
