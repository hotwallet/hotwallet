import React, { useEffect } from 'react'
import moment from 'moment'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { Button, Table, Image, Icon, Message, Input } from 'semantic-ui-react'
import { getLedgerWallets } from '../ventiSelectors/transactions'
import { withTheme, compose } from '../contexts'
import { useVenti } from 'venti'

import { startLedger } from '../ventiStore/ledger'
import { deleteWallet, setWalletName } from '../ventiStore/wallets'

const rowStyle = {}

const headerStyle = {
  ...rowStyle,
  backgroundColor: 'rgba(0,0,0,.3)'
}

const smallFont = {
  fontSize: 12,
  color: '#999'
}

const cellStyle = {
  color: '#fff',
  borderBottom: '1px solid #444',
  padding: '15px 10px',
  verticalAlign: 'top'
}

function Ledger({
  isMobile
}) {
  const state = useVenti()
  const status = state.get('ledger.data')
  const wallets = getLedgerWallets()
  useEffect(() => {
    startLedger()
  }, [])

  const renderError = (error) => {
    return (
      <Message icon color="black">
        <Icon name="exclamation circle" />
        <Message.Content>
          <Message.Header>Try a different web browser</Message.Header>
          {error.message.replace("Also make sure you're on an HTTPS connection", '')}
        </Message.Content>
      </Message>
    )
  }

  const renderInstructions = () => {
    return (
      <Message icon color="black">
        <Icon name="usb" />
        <Message.Content>
          <Message.Header>Ledger Disconnected</Message.Header>
          Plug in and choose a currency on your Ledger device
        </Message.Content>
      </Message>
    )
  }

  const renderLedgerStatus = ({ status }) => {
    const { symbol, error } = status
    if (error) {
      return renderError(error)
    }
    if (!symbol) {
      return renderInstructions()
    }
    return (
      <Message color="black">
        <Message.Content>
          <Message.Header>
            <Icon name="check circle" size="large" />
            {symbol} Connected
          </Message.Header>
        </Message.Content>
      </Message>
    )
  }

  const onClickDeleteWallet = event => {
    const el = event.target
    const id = el.parentNode.getAttribute('data-id') || el.getAttribute('data-id')
    const name = el.parentNode.getAttribute('data-name') || el.getAttribute('data-name')
    const confirmed = window.confirm(`Delete ${name}?`)
    if (confirmed) {
      deleteWallet(id)
    }
  }

  const onChangeWalletName = event => {
    const id = event.target.parentNode.getAttribute('data-walletid')
    const name = event.target.value
    setWalletName(id, name)
  }

  const renderTable = () => {
    return (
      <Table
        basic="very"
        celled
        compact="very"
        unstackable
      >
        <Table.Header>
          <Table.Row style={headerStyle}>
            <Table.HeaderCell
              style={cellStyle}
              colSpan={4}
            >Ledger Wallets</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {wallets.map(wallet => {
            const iconSrc = `https://chnnl.imgix.net/tarragon/icons/32x32/${wallet.symbol}.png`
            return (
              <Table.Row style={rowStyle} key={wallet.id}>
                <Table.Cell style={{ ...cellStyle, width: 32 }}>
                  <Image src={iconSrc} />
                </Table.Cell>
                <Table.Cell style={{ ...cellStyle, width: '50%' }}>
                  <div>
                    <Input
                      data-walletid={wallet.id}
                      defaultValue={wallet.name}
                      inverted
                      transparent
                      fluid
                      onChange={onChangeWalletName}
                    />
                  </div>
                  <div>
                    {wallet.isSegwit === false ? <span style={smallFont}>Legacy</span> : ''}
                  </div>
                </Table.Cell>
                <Table.Cell style={cellStyle} textAlign="right">
                  {Object.keys(wallet.balances)
                    .filter(symbol => {
                      if (wallet.symbol === 'ETH' && symbol !== 'ETH') return false
                      return symbol && (symbol === wallet.symbol || Number(wallet.balances[symbol]) > 0)
                    })
                    .map(symbol => (
                      <div key={`${wallet.id}:${symbol}`}>
                        {wallet.balances[symbol]}
                        <span style={{ marginLeft: 8 }}>{symbol}</span>
                      </div>
                    ))}
                  <div style={smallFont}>Updated {moment(wallet.lastSync).fromNow()}</div>
                </Table.Cell>
                <Table.Cell style={{ ...cellStyle, width: 32 }} textAlign="right">
                  <Button
                    data-id={wallet.id}
                    data-name={wallet.name}
                    inverted
                    basic
                    color="red"
                    icon="remove"
                    onClick={onClickDeleteWallet}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }

  return (
    <div>
      <H1
        text="Ledger Connect"
        subtitle="Bitcoin, Ethereum, Litecoin, and Zcash are currently supported."
      />
      <div
        style={{
          padding: isMobile ? mobilePadding : desktopPadding
        }}
      >
        {renderLedgerStatus()}
        {wallets.length ? renderTable() : ''}
      </div>
    </div>
  )
}

export default compose(
  withTheme
)(Ledger)
