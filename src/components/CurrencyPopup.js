import React from 'react'
import { darkBg } from '../lib/styles'
import CurrencyButton from './CurrencyButton'
import { PropTypes } from 'prop-types'
import { setBaseCurrency } from '../ventiStore/user'

export default function CurrencyPopup({
  baseCurrency,
  currencies,
  onClick,
  active
}) {
  const currenciesList = currencies.filter((c) => c !== baseCurrency)
  currenciesList.unshift(baseCurrency)
  const style = {
    ...popupStyle,
    display: active ? 'block' : 'none'
  }
  return (
    <div>
      <div style={style}>
        {currenciesList.map((currency) => (
          <div key={currency}>
            <CurrencyButton
              currency={currency}
              onClick={() => {
                setBaseCurrency(currency)
                if (onClick) onClick()
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

CurrencyPopup.propTypes = {
  baseCurrency: PropTypes.string.isRequired,
  currencies: PropTypes.array.isRequired,
  onClick: PropTypes.func
}

const popupStyle = {
  position: 'absolute',
  backgroundColor: darkBg,
  zIndex: 1100,
  padding: 8,
  marginLeft: -8,
  marginTop: -8
}
