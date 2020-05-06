import React, { useState } from 'react'
import '../lib/currency-flags.min.css'
import CurrencyButton from './CurrencyButton'
import CurrencyPopup from './CurrencyPopup'
import PropTypes from 'prop-types'

function CurrencySelector({ currencies, baseCurrency, setBaseCurrency }) {
  const [active, setActive] = useState(false)

  return (
    <div>
      <CurrencyPopup
        active={active}
        onClick={() => setActive(false)}
        currencies={currencies}
        baseCurrency={baseCurrency}
        setBaseCurrency={setBaseCurrency}
      />
      <CurrencyButton
        currency={baseCurrency}
        caret
        onClick={() => setActive(!active)}
      />
    </div>
  )
}

CurrencySelector.propTypes = {
  baseCurrency: PropTypes.string.isRequired,
  setBaseCurrency: PropTypes.func.isRequired,
  currencies: PropTypes.array.isRequired
}

export default CurrencySelector
