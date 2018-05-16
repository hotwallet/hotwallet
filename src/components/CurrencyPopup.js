import React from 'react'
import { darkBg } from '../lib/styles'
import CurrencyButton from './CurrencyButton'
import { PropTypes } from 'prop-types'

class CurrencyPopup extends React.PureComponent {
  render() {
    const baseCurrency = this.props.baseCurrency
    const currencies = this.props.currencies.filter(c => c !== baseCurrency)
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

export default CurrencyPopup
