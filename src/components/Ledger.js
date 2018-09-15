import React from 'react'
import { connect } from 'react-redux'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'
import { Table, Image, Icon } from 'semantic-ui-react'

const rowStyle = {}

const headerStyle = {
  ...rowStyle,
  backgroundColor: 'rgba(0,0,0,.3)'
}

const cellStyle = {
  color: '#fff',
  borderBottom: '1px solid #444',
  padding: '15px 0 15px 10px'
}

class Ledger extends React.Component {
  componentDidMount() {
    this.props.startLedger()
  }

  renderInstructions() {
    return (
      <div class="ui inverted icon message">
        <Icon name="usb circle" />
        <div class="content">
          <div class="header">No Ledger Device Present</div>
          <div>Plug in and choose a currency on your Ledger device</div>
        </div>
      </div>
    )
  }

  renderLedgerStatus() {
    const symbol = this.props.status.symbol
    if (!symbol) {
      return this.renderInstructions()
    }
    return (
      <div class="ui inverted icon message">
        <Icon name="check circle" />
        <div class="content">
          <div class="header">{symbol} Connected</div>
        </div>
      </div>
    )
  }

  render() {
    const security = {
      symbol: 'BTC',
      name: 'Bitcoin'
    }
    const wallet = {
      name: 'My Bitcoin Wallet',
      isSegwit: false,
      balance: '0.12345',
      id: 'BTC:1234567'
    }
    const iconSrc = `https://chnnl.imgix.net/tarragon/icons/32x32/${security.symbol}.png`
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
                <Table.HeaderCell style={cellStyle}>Wallet</Table.HeaderCell>
                <Table.HeaderCell style={cellStyle} textAlign="right">Balance</Table.HeaderCell>
                <Table.HeaderCell style={cellStyle} />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row style={rowStyle} key={wallet.id}>
                <Table.Cell style={cellStyle}>
                  <Image
                    src={iconSrc}
                    inline
                    verticalAlign="middle"
                    style={{ marginRight: 12 }}
                  />
                  {wallet.name} {wallet.isSegwit ? '' : '(legacy)'}
                </Table.Cell>
                <Table.Cell style={cellStyle} textAlign="right">
                  {wallet.balance} {security.symbol}
                </Table.Cell>
                <Table.Cell style={cellStyle} textAlign="right">
                  <Icon name="remove circle" size="large" />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  status: state.ledger.status || {}
})

export default connect(mapStateToProps, mapDispatchToProps)(Ledger)
