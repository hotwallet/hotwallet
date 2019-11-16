import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Button, Table, Image, Input, Dropdown } from 'semantic-ui-react'
import H1 from './H1'
import { mapDispatchToProps } from '../actions'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { getTrezorWallets } from '../selectors/transactions'
import { getSecurity } from '../selectors/securities'
import { supportedSymbols } from '../actions/trezor'
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

class Trezor extends React.PureComponent {
  onClickDeleteWallet = event => {
    const id = event.target.parentNode.getAttribute('data-id')
    const name = event.target.parentNode.getAttribute('data-name')
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
            >Trezor Wallets</Table.HeaderCell>
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

  getAccount = security => () => this.props.getTrezorAccountInfo(security)

  render() {
    const wallets = this.props.wallets
    return (
      <div>
        <H1 text="Trezor Connect" />
        <div
          style={{
            padding: this.props.isMobile ? mobilePadding : desktopPadding
          }}
        >
          <Dropdown
            text="Add Trezor Wallet"
            icon="plus"
            floating
            labeled
            button
            className="icon"
          >
            <Dropdown.Menu>
              <Dropdown.Header content="Choose type of wallet" />
              {this.props.trezorSecurities.map(security =>
                <Dropdown.Item
                  key={security.symbol}
                  text={security.name}
                  value={security.symbol}
                  color="black"
                  onClick={this.getAccount(security)}
                />)}
            </Dropdown.Menu>
          </Dropdown>

          {wallets.length ? this.renderTable() : ''}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  wallets: getTrezorWallets(state),
  trezorSecurities: supportedSymbols
    .map(symbol => getSecurity(state, symbol))
    .sort((a, b) => a.name > b.name ? 1 : -1)
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTheme
)(Trezor)
