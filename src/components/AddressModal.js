import React, { useState } from 'react'
import { Modal, Button, Input, Image } from 'semantic-ui-react'
import { lightBg, borderColor } from '../lib/styles'
import { PropTypes } from 'prop-types'
import { withTheme } from '../contexts'

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

function AddressModal({ security = {}, addWallet, openAddressModal, fetchWalletBalances, isModalOpen }) {
  const [address, setAddress] = useState()

  const connectWallet = () => {
    const newWallet = {
      symbol: security.addressType
    }
    const inputAddress = address
    // naive hd xpub detection logic
    if (security.hasHD && inputAddress.length > 64) {
      newWallet.xpub = inputAddress
    } else {
      newWallet.address = inputAddress
    }
    addWallet(newWallet)
    openAddressModal({ isOpen: false })
    fetchWalletBalances()
  }

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
          style={{ marginRight: 12 }}
        />
        <span style={{
          fontSize: 18,
          verticalAlign: 'middle'
        }}>Track {security.symbol} Balance</span>
      </Modal.Header>
      <Modal.Content>
        <fieldset style={fieldsetStyle}>
          <label style={labelStyle}>
            {security.addressType} Address
            {security.hasHD ? ' or HD Wallet' : ''}
          </label>
          <Input
            transparent
            focus
            fluid
            inverted
            color="#fff"
            style={inputStyle}
            onChange={e => setAddress(e.target.value)}
          />
        </fieldset>
        <Button
          color="blue"
          fluid
          style={buttonStyle}
          onClick={connectWallet}
        >Continue</Button>
      </Modal.Content>
    </Modal>
  )
}

AddressModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  openAddressModal: PropTypes.func.isRequired,
  security: PropTypes.shape({
    symbol: PropTypes.string.isRequired,
    addressType: PropTypes.string,
    hasHD: PropTypes.bool
  })
}

export default withTheme(AddressModal)
