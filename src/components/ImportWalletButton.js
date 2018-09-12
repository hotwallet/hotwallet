import React from 'react'
import { Button } from 'semantic-ui-react'

class ImportWalletButton extends React.Component {
  onClick = () => {
    this.props.onClick(this.props.security.symbol)
  }

  render() {
    const symbol = this.props.security.symbol
    const hasHDWalletSupport = (symbol === 'BTC')
    return (
      <Button
        key="import-wallet"
        color="black"
        fluid
        style={this.props.style}
        onClick={this.onClick}
      >
        {symbol} Address
        {hasHDWalletSupport ? ' or HD Wallet' : ''}
      </Button>
    )
  }
}

export default ImportWalletButton
