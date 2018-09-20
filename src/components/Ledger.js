import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import { Table, Image, Icon, Message, Input } from 'semantic-ui-react'
import { getLedgerWallets } from '../selectors/transactions'

const rowStyle = {}

const headerStyle = {
  ...rowStyle,
  backgroundColor: 'rgba(0,0,0,.3)'
}

const cellStyle = {
  color: '#fff',
  borderBottom: '1px solid #444',
  padding: '15px 10px'
}

class Ledger extends React.Component {
  componentDidMount() {
    this.props.startLedger()
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
    const symbol = this.props.status.symbol
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

  onChangeWalletName = event => {
    const id = event.target.parentNode.getAttribute('data-walletid')
    const name = event.target.value
    this.props.setWalletName(id, name)
  }

  render() {
    const wallets = this.props.wallets
    return (
      <div>
        <H1 text="Ledger Connect" />
        <div
          style={{
            padding: this.props.isMobile ? mobilePadding : desktopPadding
          }}
        >
          {this.renderLedgerStatus()}
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
                    <Table.Cell style={cellStyle}>
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
                        {wallet.isSegwit ? '' : '(legacy)'}
                      </div>
                    </Table.Cell>
                    <Table.Cell style={cellStyle} textAlign="right">
                      {Object.keys(wallet.balances).map(symbol => (
                        <div key={`${wallet.id}:${symbol}`}>
                          <div>
                            {wallet.balances[symbol]}
                            <span style={{ marginLeft: 8 }}>{symbol}</span>
                          </div>
                          <div>Updated {moment(wallet.lastSync).fromNow()}</div>
                        </div>
                      ))}
                    </Table.Cell>
                    <Table.Cell style={cellStyle} textAlign="right">
                      <Icon name="remove circle" size="large" />
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  status: state.ledger.data || {},
  wallets: getLedgerWallets(state)
})

export default connect(mapStateToProps, mapDispatchToProps)(Ledger)
