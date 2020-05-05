import React from 'react'
import { darkBg } from '../lib/styles'
import CurrencyButton from './CurrencyButton'
import { PropTypes } from 'prop-types'

export default function CurrencyPopup({
  baseCurrency,
  setBaseCurrency,
  currencies,
  onClick,
  active
}) {
  const currencies1 = currencies.filter((c) => c !== baseCurrency)
  currencies1.unshift(baseCurrency)
  const style = {
    ...popupStyle,
    display: active ? 'block' : 'none'
  }
  return (
    <div>
      <div style={style}>
        {currencies1.map((currency) => (
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
  setBaseCurrency: PropTypes.func.isRequired,
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
