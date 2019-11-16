import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import { Button, Table, Image, Icon, Message, Input } from 'semantic-ui-react'
import { getLedgerWallets } from '../selectors/transactions'
import { withTheme, compose } from '../contexts'

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

class Ledger extends React.PureComponent {
  componentDidMount() {
    this.props.startLedger()
  }

  renderError(error) {
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

  renderInstructions() {
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

  renderLedgerStatus() {
    const { symbol, error } = this.props.status
    if (error) {
      return this.renderError(error)
    }
    if (!symbol) {
      return this.renderInstructions()
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

  onClickDeleteWallet = event => {
    const el = event.target
    const id = el.parentNode.getAttribute('data-id') || el.getAttribute('data-id')
    const name = el.parentNode.getAttribute('data-name') || el.getAttribute('data-name')
    const confirmed = window.confirm(`Delete ${name}?`)
    if (confirmed) {
      this.props.deleteWallet(id)
    }
  }

  onChangeWalletName = event => {
    const id = event.target.parentNode.getAttribute('data-walletid')
    const name = event.target.value
    this.props.setWalletName(id, name)
  }

  renderTable() {
    const wallets = this.props.wallets
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
                      onChange={this.onChangeWalletName}
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
                    onClick={this.onClickDeleteWallet}
                  />
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    )
  }

  render() {
    const wallets = this.props.wallets
    return (
      <div>
        <H1
          text="Ledger Connect"
          subtitle="Bitcoin, Ethereum, Litecoin, and Zcash are currently supported."
        />
        <div
          style={{
            padding: this.props.isMobile ? mobilePadding : desktopPadding
          }}
        >
          {this.renderLedgerStatus()}
          {wallets.length ? this.renderTable() : ''}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  status: state.ledger.data || {},
  wallets: getLedgerWallets(state)
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTheme
)(Ledger)
