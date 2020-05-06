import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'
import CurrencyIcon from './CurrencyIcon'
import { PropTypes } from 'prop-types'

function CurrencyButton({ currency, onClick, caret }) {
  const [hover, setHover] = useState(false)
  let style = hover ? buttonStyleHover : buttonStyle
  return (
    <button
      style={style}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={onClick}
    >
      <CurrencyIcon currency={currency} style={{ display: 'inline-block' }} />
      <Icon
        name="caret down"
        style={{
          display: 'inline-block',
          visibility: caret ? 'visible' : 'hidden'
        }}
      />
    </button>
  )
}

CurrencyButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  currency: PropTypes.string.isRequired,
  caret: PropTypes.bool
}

const buttonStyle = {
  border: 'none',
  borderRadius: 4,
  padding: '8px 8px 8px 15px',
  outline: 'none'
}

const buttonStyleHover = {
  ...buttonStyle,
  backgroundColor: lightBg
}

export default CurrencyButton
