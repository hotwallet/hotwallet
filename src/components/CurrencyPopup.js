import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { darkBg } from '../lib/styles'
import CurrencyButton from './CurrencyButton'
import { setBaseCurrency } from '../actions/user'

const supportedCurrencies = [
  'USD', 'EUR', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK',
  'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN',
  'MYR', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'RUB', 'SEK', 'SGD', 'THB',
  'TRY', 'TWD', 'ZAR'
]

class CurrencyPopup extends React.Component {
  render() {
    const baseCurrency = this.props.baseCurrency
    const currencies = supportedCurrencies.filter(c => c !== baseCurrency)
    currencies.unshift(baseCurrency)
    const style = {
      ...popupStyle,
      display: this.props.active ? 'block' : 'none'
    }
    return (
      <div>
        <div style={style}>
          {currencies.map(currency =>
            <div key={currency}>
              <CurrencyButton
                currency={currency}
                onClick={() => {
                  this.props.setBaseCurrency(currency)
                  if (this.props.onClick) this.props.onClick()
                }}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
}

const popupStyle = {
  position: 'absolute',
  backgroundColor: darkBg,
  zIndex: 1100,
  padding: 8,
  marginLeft: -8,
  marginTop: -8
}

const mapStateToProps = state => ({
  baseCurrency: state.user.baseCurrency
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setBaseCurrency
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyPopup)
