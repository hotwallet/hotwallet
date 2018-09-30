import React from 'react'
import { Button } from 'semantic-ui-react'

class ImportWalletButton extends React.Component {
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

export default ImportWalletButton
