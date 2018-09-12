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

class AddressModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  connectWallet = () => {
    this.props.addWallet({
      symbol: this.props.security.addressType,
      address: this.state.address
    })
    this.props.openAddressModal({ isOpen: false })
    this.props.fetchWalletBalances()
  }

  render() {
    const {
      isModalOpen,
      openAddressModal,
      security = {}
    } = this.props
    return (
      <Modal
        closeIcon
        size="mini"
        open={isModalOpen}
        onClose={() => openAddressModal({ isOpen: false })}
        style={{
          backgroundColor: lightBg
        }}
      >
        <Modal.Header style={{ color: '#fff' }}>
          <Image
            src={`https://chnnl.imgix.net/tarragon/icons/32x32/${security.symbol}.png`}
            inline
            verticalAlign="middle"
            style={{marginRight: 12}}
          />
          <span style={{
            fontSize: 18,
            verticalAlign: 'middle'
          }}>Track {security.name} Balance</span>
        </Modal.Header>
        <Modal.Content>
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              {security.addressType} Address
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
          >Continue</Button>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(AddressModal)
