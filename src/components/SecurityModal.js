import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Modal, Button, Table, Divider, Input, Image } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'
import PricesInputQty from './PricesInputQty'
import ImportWalletButton from './ImportWalletButton'
import { binanceSymbols, supportedWallets } from '../config'

const buttonStyle = {
  marginBottom: 5
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
      manualTxTime: '',
      inputHasFocus: false
    }
  }

  onOpen = () => {

  }

  setManualBalance = (manualBalance) => {
    this.setState({ manualBalance })
  }

  getImportButtons() {
    return [
      this.getImportWalletButton(),
      this.getImportBinanceButton()
    ].filter(Boolean)
  }

  onClickImportBinanceButton = () => {
    const { openBinanceSetupModal } = this.props
    this.close()
    openBinanceSetupModal(true)
  }

  onClickImportWalletButton = (wallet) => {
    this.close()
    const modalName = `open${wallet}SetupModal`
    if (!this.props[modalName]) return
    this.props[modalName](true)
  }

  getImportBinanceButton() {
    const { security } = this.props
    if (this.props.binanceApiKey) return
    if (!binanceSymbols.includes(security.symbol)) return
    return (
      <Link to="/binance">
        <Button
          key="import-binance"
          color="black"
          fluid
          style={buttonStyle}
        >
          Binance Connect
        </Button>
      </Link>
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
      <ImportWalletButton
        key="import-wallet"
        wallet={wallet}
        style={buttonStyle}
        onClick={this.onClickImportWalletButton}
      />
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

  onInputFocus = () => {
    this.setState({ inputHasFocus: true })
  }

  onInputBlur = () => {
    // this.setState({ inputHasFocus: false })
  }

  onChangeDateInput = (e) => {
    this.setState({ manualTxTime: new Date(e.target.value).toISOString() })
  }

  close = () => {
    this.props.onClose()
    this.setState({ inputHasFocus: false })
  }

  render() {
    const {
      isModalOpen,
      security,
      transactionsBySymbol
    } = this.props

    if (!security) {
      return null
    }

    const importButtons = this.getImportButtons()
    const { symbol } = security
    const balances = (transactionsBySymbol[symbol] || []).reduce((b, val) => {
      b[val.walletId] = val.balance
      return b
    }, {})
    const importedWalletIds = Object.keys(balances).filter(k => k !== 'manual')
    const clearButton = isNumber(balances.manual) && this.state.manualBalance === ''

    const getWalletName = walletId => {
      if (walletId.includes(':')) return walletId.split(':')[1].substr(0, 10)
      return walletId
    }

    return (
      <Modal
        closeIcon
        size="mini"
        open={isModalOpen}
        onClose={this.close}
        onOpen={this.onOpen}
        style={{
          backgroundColor: lightBg
        }}
      >
        <Modal.Header style={{ color: '#fff' }}>
          <div>
            <Image
              src={this.props.iconSrc}
              inline
              verticalAlign="middle"
              style={{ marginRight: 12 }}
            />
            <span style={{
              fontSize: 18,
              verticalAlign: 'middle',
              display: 'inline'
            }}>{this.props.security.name}</span>
          </div>

        </Modal.Header>
        <Modal.Content style={{ paddingTop: 0 }}>
          <Table basic="very" celled compact="very">
            <Table.Body>
              <Table.Row style={rowStyle} key="manual">
                <Table.Cell
                  textAlign="left"
                  verticalAlign={this.state.inputHasFocus ? 'top' : 'middle'}
                  style={{
                    marginTop: this.state.inputHasFocus ? 10 : 0
                  }}
                >
                  Manual Entry
                </Table.Cell>
                <Table.Cell width="ten">
                  <PricesInputQty
                    setBalance={this.setManualBalance}
                    isMobile={this.props.isMobile}
                    symbol={symbol}
                    balance={balances.manual}
                    onFocus={this.onInputFocus}
                    onBlur={this.onInputBlur}
                  />
                  <div style={{
                    display: this.state.inputHasFocus ? 'block' : 'none'
                  }}>
                    <Divider fitted horizontal style={{ margin: '5px 0', ...dividerStyle }}>as of</Divider>
                    <Input
                      fluid
                      inverted
                      onFocus={this.onInputFocus}
                      onBlur={this.onInputBlur}
                      onChange={this.onChangeDateInput}
                      type="date"
                      defaultValue={moment().format('YYYY-MM-DD')}
                      style={{ marginBottom: 10 }}
                    />
                    {!clearButton &&
                      <Button
                        color="blue"
                        fluid
                        style={buttonStyle}
                        onClick={() => {
                          this.save()
                          this.close()
                        }}
                      >Save</Button>
                    }
                    {clearButton &&
                      <Button
                        color="red"
                        fluid
                        style={buttonStyle}
                        onClick={() => {
                          this.props.removeManualTransactions(this.props.security.symbol)
                          this.setState({ manualBalance: undefined })
                          this.close()
                        }}
                      >Clear History</Button>
                    }
                  </div>
                </Table.Cell>
              </Table.Row>

              {importedWalletIds.map(walletId => (
                <Table.Row style={rowStyle} key={walletId}>
                  <Table.Cell textAlign="left">
                    {getWalletName(walletId)}
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
