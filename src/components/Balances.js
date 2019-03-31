import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Button, Table, Divider, Input } from 'semantic-ui-react'
import PricesInputQty from './PricesInputQty'
import ImportWalletButton from './ImportWalletButton'
import { binanceSymbols } from '../config'
import { getLedgerSymbols } from '../actions/ledger'

const ledgerSymbols = getLedgerSymbols()
const trezorSymbols = ['BTC']

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

class Symbol extends React.PureComponent {
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
      this.getImportBinanceButton(),
      this.getImportLedgerButton(),
      this.getImportTrezorButton()
    ].filter(Boolean)
  }

  onClickImportWalletButton = () => {
    this.close()
    this.props.openAddressModal({
      security: this.props.security,
      isOpen: true
    })
  }

  getImportBinanceButton() {
    const { security } = this.props
    if (this.props.binanceApiKey) return
    if (!binanceSymbols.includes(security.addressType)) return
    return (
      <Link to="/binance" key="binance">
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

  getImportLedgerButton() {
    const { security } = this.props
    if (!ledgerSymbols.includes(security.addressType)) return
    return (
      <Link to="/ledger" key="ledger">
        <Button
          color="black"
          fluid
          style={buttonStyle}
        >
          Ledger Connect
        </Button>
      </Link>
    )
  }

  getImportTrezorButton() {
    const { security } = this.props
    if (!trezorSymbols.includes(security.addressType)) return
    return (
      <Link to="/trezor" key="trezor">
        <Button
          color="black"
          fluid
          style={buttonStyle}
        >
          Trezor Connect
        </Button>
      </Link>
    )
  }

  getImportWalletButton() {
    const { security } = this.props
    if (!security.addressType) return
    return (
      <ImportWalletButton
        key="import-wallet"
        security={security}
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
    this.setState({ inputHasFocus: false })
  }

  render() {
    const {
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
      const wallet = this.props.wallets[walletId]
      if (wallet && wallet.name) return wallet.name
      if (walletId.includes(':')) return walletId.split(':')[1].substr(0, 10)
      return walletId
    }

    return (
      <div style={{ marginBottom: 25 }}>
        <div style={{ color: '#fff', marginTop: 25 }}>
          <span style={{
            fontSize: 18
          }}>Balances</span>
        </div>
        <Divider />
        <div style={{ paddingTop: 0 }}>
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
              <Divider horizontal section style={dividerStyle}>Track Balances</Divider>
              {importButtons}
            </div>
          ) : ''}

        </div>
      </div>
    )
  }
}

Symbol.propTypes = {
  security: PropTypes.object,
  iconSrc: PropTypes.string,
  addManualTransaction: PropTypes.func.isRequired,
  removeManualTransactions: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isMobile: state.ephemeral.isMobile,
  binanceApiKey: state.binance.apiKey,
  transactionsBySymbol: state.transactions.bySymbol,
  wallets: state.wallets
})

export default connect(mapStateToProps)(Symbol)
