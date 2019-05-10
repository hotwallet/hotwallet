import React from 'react'
import CurrencySelector from '../components/CurrencySelector'
import { accountService } from '../services'
import { withAccountUpdates } from '../db'

const currencies = [
  'USD', 'EUR', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK',
  'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN',
  'MYR', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'RUB', 'SEK', 'SGD', 'THB',
  'TRY', 'TWD', 'ZAR'
]

function setBaseCurrency(baseCurrency) {
  return accountService.updateAccount({ baseCurrency })
}

function CurrencyContainer(props) {
  const { baseCurrency } = props
  if (!baseCurrency) return <i />
  return React.createElement(CurrencySelector, {
    baseCurrency,
    setBaseCurrency,
    currencies
  })
}

function getData(props) {
  return accountService.getPrimaryAccount()
}

function shouldUpdate(change, props) {
  const { baseCurrency } = props
  return change.affects({ baseCurrency })
}

export default withAccountUpdates(getData, shouldUpdate)(CurrencyContainer)
