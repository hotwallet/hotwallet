import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Table, Input, Divider } from 'semantic-ui-react'
import { lightBg, borderColor } from '../lib/styles'
import PricesInputQty from './PricesInputQty'
import { binanceSymbols, supportedWallets } from '../config'

const buttonStyle = {
  marginBottom: 10
}
const rowStyle = {
  color: '#fff',
  textAlign: 'center'
}
const dividerStyle = {
  color: '#999'
}
const labelStyle = {
  marginBottom: 5,
  display: 'inline-block'
}

class SecurityModal extends React.Component {
  getImportButtons() {
    return [
      this.getImportWalletButton(),
      this.getImportBinanceButton()
    ].filter(Boolean)
  }

  getImportBinanceButton() {
    const { security } = this.props
    if (!binanceSymbols.includes(security.symbol)) return
    return (
      <Button key="import-binance" color="black" fluid style={buttonStyle}>Import from Binance</Button>
    )
  }

  getImportWalletButton() {
    const { security } = this.props
    const wallet = Object.keys(supportedWallets).find(w => {
      const symbols = supportedWallets[w]
      return symbols.find(s => s === security.symbol)
    })
    if (!wallet) return
    return (
      <Button key="import-wallet" color="black" fluid style={buttonStyle}>Import {wallet} wallet</Button>
    )
  }

  render() {
    const {
      isModalOpen,
      header,
      onClose,
      security,
      balance,
      isMobile,
      addManualTransaction
    } = this.props

    const importButtons = this.getImportButtons()

    return (
      <Modal
        closeIcon
        size="mini"
        open={isModalOpen}
        onClose={onClose}
        style={{
          backgroundColor: lightBg
        }}
      >
        <Modal.Header style={{ color: '#fff' }}>{header}</Modal.Header>
        <Modal.Content>
          <Divider horizontal fitted style={dividerStyle}>Manual Entry</Divider>
          <Table basic="very" celled collapsing>
            <Table.Body>
              <Table.Row style={rowStyle}>
                <Table.Cell>
                  <label style={labelStyle}>
                    Balance
                  </label>
                  <PricesInputQty
                    symbol={security.symbol}
                    balance={balance}
                    addManualTransaction={addManualTransaction}
                  />
                </Table.Cell>
                <Table.Cell>
                  <label style={labelStyle}>
                    As of date
                  </label>
                  <Input
                    disabled
                    transparent
                    focus
                    inverted
                    color="#fff"
                    type="date"
                    style={{
                      backgroundColor: 'none',
                      padding: isMobile ? '0.25em 0.5em 0.25em 1em' : '0.5em 0.5em 0.5em 1em',
                      border: `2px solid ${borderColor}`,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          <Button color="blue" fluid style={buttonStyle} onClick={onClose}>Done</Button>

          {importButtons.length ? (
            <div>
              <Divider horizontal section style={dividerStyle}>Import balances</Divider>
              {importButtons}
            </div>
          ) : ''}

        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(SecurityModal)
