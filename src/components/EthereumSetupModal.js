import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { Modal, Button, Input, Image } from 'semantic-ui-react'
import { lightBg, borderColor } from '../lib/styles'

const buttonStyle = {
  marginBottom: 20
}
const inputStyle = {
  backgroundColor: 'none',
  padding: '0.5em 0.5em 0.5em 1em',
  border: `2px solid ${borderColor}`,
  textAlign: 'center',
  outline: 'none'
}
const labelStyle = {
  marginBottom: 5,
  display: 'block'
}
const fieldsetStyle = {
  border: 'none',
  margin: 0,
  padding: 0,
  marginBottom: 20
}

class EthereumSetupModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  connectWallet = () => {
    this.props.addWallet({
      symbol: 'ETH',
      address: this.state.address
    })
    this.props.openEthereumSetupModal(false)
    this.props.fetchWalletBalances()
  }

  render() {
    const {
      isModalOpen,
      openEthereumSetupModal
    } = this.props

    return (
      <Modal
        closeIcon
        size="mini"
        open={isModalOpen}
        onClose={() => openEthereumSetupModal(false)}
        style={{
          backgroundColor: lightBg
        }}
      >
        <Modal.Header style={{ color: '#fff' }}>
          <Image
            src="https://chnnl.imgix.net/tarragon/icons/32x32/ETH.png"
            inline
            verticalAlign="middle"
            style={{marginRight: 12}}
          />
          <span style={{
            fontSize: 18,
            verticalAlign: 'middle'
          }}>Import Ethereum Wallet</span>
        </Modal.Header>
        <Modal.Content>
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              ETH Address
            </label>
            <Input
              transparent
              focus
              fluid
              inverted
              color="#fff"
              style={inputStyle}
              onChange={e => this.setState({ address: e.target.value })}
            />
          </fieldset>
          <Button
            color="blue"
            fluid
            style={buttonStyle}
            onClick={this.connectWallet}
          >Connect</Button>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(EthereumSetupModal)
