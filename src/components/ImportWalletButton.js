import React from 'react'
import { Button } from 'semantic-ui-react'

class ImportWalletButton extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick() {
    this.props.onClick(this.props.wallet)
  }

  render() {
    return (
      <Button
        key="import-wallet"
        color="black"
        fluid
        style={this.props.style}
        onClick={this.onClick}
      >Import {this.props.wallet} wallet</Button>
    )
  }
}

export default ImportWalletButton
