import React from 'react'
import { Button } from 'semantic-ui-react'
import { PropTypes } from 'prop-types'

class ImportWalletButton extends React.PureComponent {
  onClick = () => {
    this.props.onClick(this.props.security.symbol)
  }

  render() {
    const security = this.props.security
    return (
      <Button
        key="import-wallet"
        color="black"
        fluid
        style={this.props.style}
        onClick={this.onClick}
      >
        {security.addressType} Address
        {security.hasHD ? ' or HD Wallet' : ''}
      </Button>
    )
  }
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

export default ImportWalletButton
