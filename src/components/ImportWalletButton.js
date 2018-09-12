import React from 'react'
import { Button } from 'semantic-ui-react'

class ImportWalletButton extends React.Component {
  onClick = () => {
    this.props.onClick(this.props.security.symbol)
  }

  render() {
    return (
      <Button
        key="import-wallet"
        color="black"
        fluid
        style={this.props.style}
        onClick={this.onClick}
      >Watch {this.props.security.name} Wallet</Button>
    )
  }
}

export default ImportWalletButton
