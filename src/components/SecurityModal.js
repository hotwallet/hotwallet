import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Table, Divider } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'
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

class SecurityModal extends React.Component {
  getImportButtons() {
    return [
      this.getImportWalletButton(),
      this.getImportBinanceButton()
    ].filter(Boolean)
  }

  getImportBinanceButton() {
    const { security, onClose, openBinanceSetupModal } = this.props
    if (this.props.binanceApiKey) return
    if (!binanceSymbols.includes(security.symbol)) return
    return (
      <Button
        key="import-binance"
        color="black"
        fluid
        style={buttonStyle}
        onClick={() => {
          onClose()
          openBinanceSetupModal(true)
        }}
      >
        Import from Binance
      </Button>
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
      transactionsBySymbol,
      addManualTransaction
    } = this.props

    const importButtons = this.getImportButtons()
    const { symbol } = security
    const balances = transactionsBySymbol[symbol].reduce((b, val) => {
      b[val.walletId] = val.balance
      return b
    }, {})
    const importedWalletIds = Object.keys(balances).filter(k => k !== 'manual')

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
          <Table basic="very" celled>
            <Table.Body>
              <Table.Row style={rowStyle} key="manual">
                <Table.Cell textAlign="left">
                  Manual Entry
                </Table.Cell>
                <Table.Cell>
                  <PricesInputQty
                    symbol={symbol}
                    balance={balances.manual}
                    addManualTransaction={addManualTransaction}
                  />
                </Table.Cell>
              </Table.Row>
              {importedWalletIds.map(walletId => (
                <Table.Row style={rowStyle} key={walletId}>
                  <Table.Cell textAlign="left">
                    {walletId}
                  </Table.Cell>
                  <Table.Cell>
                    <PricesInputQty
                      symbol={symbol}
                      disabled
                      balance={balances[walletId]}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
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
  isMobile: state.app.isMobile,
  binanceApiKey: state.binance.apiKey,
  transactionsBySymbol: state.transactions.bySymbol
})

export default connect(mapStateToProps)(SecurityModal)
