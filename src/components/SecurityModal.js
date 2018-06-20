import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Modal, Button, Table, Divider, Input } from 'semantic-ui-react'
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

const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n)

class SecurityModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      manualTxTime: ''
    }
    this.setManualBalance = this.setManualBalance.bind(this)
    this.onClickImportBinanceButton = this.onClickImportBinanceButton.bind(this)
    this.onChangeDateInput = this.onChangeDateInput.bind(this)
  }

  setManualBalance(manualBalance) {
    this.setState({ manualBalance })
  }

  getImportButtons() {
    return [
      this.getImportWalletButton(),
      this.getImportBinanceButton()
    ].filter(Boolean)
  }

  onClickImportBinanceButton() {
    const { onClose, openBinanceSetupModal } = this.props
    onClose()
    openBinanceSetupModal(true)
  }

  getImportBinanceButton() {
    const { security } = this.props
    if (this.props.binanceApiKey) return
    if (!binanceSymbols.includes(security.symbol)) return
    return (
      <Button
        key="import-binance"
        color="black"
        fluid
        style={buttonStyle}
        onClick={this.onClickImportBinanceButton}
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

  save() {
    if (isNumber(this.state.manualBalance)) {
      this.props.addManualTransaction({
        symbol: this.props.security.symbol,
        balance: this.state.manualBalance,
        txTime: this.state.manualTxTime
      })
    }
  }

  onChangeDateInput(e) {
    this.setState({ manualTxTime: new Date(e.target.value).toISOString() })
  }

  render() {
    const {
      isModalOpen,
      getSecurityIcon,
      onClose,
      security,
      transactionsBySymbol
    } = this.props

    if (!security) {
      return null
    }

    const header = getSecurityIcon({ label: security.name, isModal: true })
    const importButtons = this.getImportButtons()
    const { symbol } = security
    const balances = (transactionsBySymbol[symbol] || []).reduce((b, val) => {
      b[val.walletId] = val.balance
      return b
    }, {})
    const importedWalletIds = Object.keys(balances).filter(k => k !== 'manual')

    const clearButton = isNumber(balances.manual) && this.state.manualBalance === ''

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
        <Modal.Content style={{ paddingTop: 0 }}>
          <Table basic="very" celled>
            <Table.Body>
              <Table.Row style={rowStyle} key="manual">
                <Table.Cell textAlign="left" verticalAlign="top" style={{ paddingTop: 20 }}>
                  Manual Entry
                </Table.Cell>
                <Table.Cell width="ten">
                  <PricesInputQty
                    setBalance={this.setManualBalance}
                    isMobile={this.props.isMobile}
                    symbol={symbol}
                    balance={balances.manual}
                  />
                  <Divider fitted horizontal style={{ margin: '5px 0', ...dividerStyle }}>as of</Divider>
                  <Input
                    fluid
                    inverted
                    onChange={this.onChangeDateInput}
                    type="date"
                    defaultValue={moment().format('YYYY-MM-DD')}
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

          {!clearButton &&
            <Button color="blue" fluid style={buttonStyle} onClick={() => {
              this.save()
              onClose()
            }}>Save</Button>
          }

          {clearButton &&
            <Button color="red" fluid style={buttonStyle} onClick={() => {
              this.props.removeManualTransactions(this.props.security.symbol)
              this.setState({manualBalance: undefined})
              onClose()
            }}>Clear History</Button>
          }

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
