import React, { useState } from 'react'
import isNumeric from '../lib/isNumeric'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'

function PricesInputQty({
  isMobile,
  disabled,
  onFocus,
  onBlur,
  setBalance,
  balance,
  symbol
}) {
  const [hasFocused, setFocus] = useState(false)

  const validateValue = (e) => {
    const value = e.target.value
    if (!isNumeric(value) || value < 0) {
      e.target.value = ''
      return false
    }
    return true
  }

  return (
    <Input
      fluid
      inverted
      ref={ref => {
        if (ref && !isMobile && !hasFocused) {
          // ref.focus()
          setFocus(true)
        }
      }}
      disabled={disabled}
      min={0}
      onFocus={e => {
        e.target.select()
        onFocus()
      }}
      onBlur={onBlur}
      onKeyUp={e => validateValue(e)}
      onChange={e => {
        validateValue(e)
        setBalance(e.target.value)
      }}
      defaultValue={balance}
      type="number"
      label={{ basic: true, content: symbol }}
      labelPosition="right"
    />
  )
}

PricesInputQty.propTypes = {
  setBalance: PropTypes.func,
  balance: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
  disabled: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func
}

export default PricesInputQty
