import React from 'react'
import CurrencySelector from '../components/CurrencySelector'
import { setBaseCurrency } from '../ventiStore/user'
import { useVenti } from 'venti'

const supportedCurrencies = [
  'USD', 'EUR', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK',
  'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN',
  'MYR', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'RUB', 'SEK', 'SGD', 'THB',
  'TRY', 'TWD', 'ZAR'
]

export default function CurrencyContainer() {
  const state = useVenti()
  const baseCurrency = state.get(`user.baseCurrency`, '')
  return React.createElement(CurrencySelector, {
    baseCurrency,
    setBaseCurrency,
    currencies: supportedCurrencies
  })
}
