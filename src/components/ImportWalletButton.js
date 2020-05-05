import React from 'react'
import { Button } from 'semantic-ui-react'
import { PropTypes } from 'prop-types'

export default function ImportWalletButton({ onClick, security, style }) {
  const onButtonClick = () => {
    onClick(security.symbol)
  }

  return (
    <Button
      key="import-wallet"
      color="black"
      fluid
      style={style}
      onClick={onButtonClick}
    >
      {security.addressType} Address
      {security.hasHD ? ' or HD Wallet' : ''}
    </Button>
  )
}

ImportWalletButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  security: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    addressType: PropTypes.string,
    hasHD: PropTypes.bool
  })
}
