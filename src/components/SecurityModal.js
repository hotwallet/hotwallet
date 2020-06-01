import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Modal, Button, Table, Divider, Input, Image } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'
import PricesInputQty from './PricesInputQty'
import ImportWalletButton from './ImportWalletButton'
import { binanceSymbols } from '../config'
import { getLedgerSymbols } from '../ventiStore/ledger'
import { withTheme, compose } from '../contexts'
import { useVenti } from 'venti'

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

function SecurityModal({
  isModalOpen,
  security,
  iconSrc,
  onClose,
  isMobile,
  removeManualTransactions,
  addManualTransaction,
  openAddressModal
}) {
  const state = useVenti()
  const transactionsBySymbol = state.get('transactions.bySymbol', {})
  const apiKey = state.get(`binance.apiKey`, '')
  const wallets = state.get(`wallets`, '')
  const [manualTxTime, setManualTxTime] = useState('')
  const [inputHasFocus, setInputHasFocus] = useState(false)
  const [manualBalance, setManualBalanceState] = useState(null)

  const onOpen = () => {

  }

  const setManualBalance = (manualBalance) => {
    setManualBalanceState(manualBalance)
  }

  const getImportButtons = () => {
    return [
      getImportWalletButton(),
      getImportBinanceButton(),
      getImportLedgerButton(),
      getImportTrezorButton()
    ].filter(Boolean)
  }

  const onClickImportWalletButton = () => {
    close()
    openAddressModal({
      security,
      isOpen: true
    })
  }

  const getImportBinanceButton = () => {
    if (apiKey) return
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

  const getImportLedgerButton = () => {
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

  const getImportTrezorButton = () => {
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

  const getImportWalletButton = () => {
    if (!security.addressType) return
    return (
      <ImportWalletButton
        key="import-wallet"
        security={security}
        style={buttonStyle}
        onClick={onClickImportWalletButton}
      />
    )
  }

  const save = () => {
    if (isNumber(manualBalance)) {
      addManualTransaction({
        symbol: security.symbol,
        balance: manualBalance,
        txTime: manualTxTime
      })
    }
  }

  const onInputFocus = () => {
    setInputHasFocus(true)
  }

  const onInputBlur = () => {
    // setInputHasFocus(false)
  }

  const onChangeDateInput = (e) => {
    setManualTxTime(new Date(e.target.value).toISOString())
  }

  const close = () => {
    onClose()
    setInputHasFocus(false)
  }

  if (!security) {
    return null
  }

  const importButtons = getImportButtons()
  const { symbol } = security
  const balances = (transactionsBySymbol[symbol] || []).reduce((b, val) => {
    b[val.walletId] = val.balance
    return b
  }, {})
  const importedWalletIds = Object.keys(balances).filter(k => k !== 'manual')
  const clearButton = isNumber(balances.manual) && manualBalance === ''

  const getWalletName = walletId => {
    const wallet = wallets[walletId]
    if (wallet && wallet.name) return wallet.name
    if (walletId.includes(':')) return walletId.split(':')[1].substr(0, 10)
    return walletId
  }

  return (
    <Modal
      closeIcon
      size="mini"
      open={isModalOpen}
      onClose={close}
      onOpen={onOpen}
      style={{
        backgroundColor: lightBg
      }}
    >
      <Modal.Header style={{ color: '#fff' }}>
        <div>
          <Image
            src={iconSrc}
            inline
            verticalAlign="middle"
            style={{ marginRight: 12 }}
          />
          <span style={{
            fontSize: 18,
            verticalAlign: 'middle',
            display: 'inline'
          }}>{security.name}</span>
        </div>

      </Modal.Header>
      <Modal.Content style={{ paddingTop: 0 }}>
        <Table basic="very" celled compact="very">
          <Table.Body>
            <Table.Row style={rowStyle} key="manual">
              <Table.Cell
                textAlign="left"
                verticalAlign={inputHasFocus ? 'top' : 'middle'}
                style={{
                  marginTop: inputHasFocus ? 10 : 0
                }}
              >
                Manual Entry
              </Table.Cell>
              <Table.Cell width="ten">
                <PricesInputQty
                  setBalance={setManualBalance}
                  isMobile={isMobile}
                  symbol={symbol}
                  balance={balances.manual}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
                <div style={{
                  display: inputHasFocus ? 'block' : 'none'
                }}>
                  <Divider fitted horizontal style={{ margin: '5px 0', ...dividerStyle }}>as of</Divider>
                  <Input
                    fluid
                    inverted
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    onChange={onChangeDateInput}
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
                        save()
                        close()
                      }}
                    >Save</Button>
                  }
                  {clearButton &&
                    <Button
                      color="red"
                      fluid
                      style={buttonStyle}
                      onClick={() => {
                        removeManualTransactions(security.symbol)
                        setManualBalanceState(undefined)
                        close()
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

      </Modal.Content>
    </Modal>
  )
}

SecurityModal.propTypes = {
  security: PropTypes.object,
  isModalOpen: PropTypes.bool.isRequired,
  iconSrc: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  addManualTransaction: PropTypes.func.isRequired,
  removeManualTransactions: PropTypes.func.isRequired,
  openAddressModal: PropTypes.func.isRequired
}

export default compose(
  withTheme
)(SecurityModal)
