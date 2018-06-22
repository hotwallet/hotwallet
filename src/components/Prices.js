import React from 'react'
import { table, desktopPadding, mobilePadding } from '../lib/styles'
import { Dimmer, Loader, Table } from 'semantic-ui-react'
import PricesRow from './PricesRow'
import PropTypes from 'prop-types'
import BinanceSetupModal from './BinanceSetupModal'
import EthereumSetupModal from './EthereumSetupModal'
import SecurityModal from './SecurityModal'

class Prices extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isBinanceSetupModalOpen: false
    }
  }

  openBinanceSetupModal = val => {
    this.setState({ isBinanceSetupModalOpen: val })
  }

  openEthereumSetupModal = val => {
    this.setState({ isEthereumSetupModalOpen: val })
  }

  getRows(securities) {
    return securities.map((security, i) => (
      <PricesRow key={security.symbol}
        rowIndex={i + this.props.symbolOffset}
        security={security}
        setLastVisibleRow={this.props.setLastVisibleRow}
        addManualTransaction={this.props.addManualTransaction}
        baseCurrency={this.props.baseCurrency}
        isMobile={this.props.isMobile}
        openBinanceSetupModal={this.openBinanceSetupModal}
        openSecurityModal={this.openSecurityModal}
        openEthereumSetupModal={this.openEthereumSetupModal}
      />
    ))
  }

  closeSecurityModal = () => {
    this.setState({isModalOpen: false})
  }

  openSecurityModal = ({ security, iconSrc }) => {
    this.setState({
      isModalOpen: true,
      modalSecurity: security,
      modalIconSrc: iconSrc
    })
  }

  render() {
    if (this.props.isFetching) {
      return (
        <Dimmer active>
          <Loader inverted content="Loading" />
        </Dimmer>
      )
    }
    if (this.props.failureMessage) {
      return (
        <div>Failed to fetch symbols:  {this.props.failureMessage} </div>
      )
    }
    const isMobile = this.props.isMobile
    const isDesktop = this.props.isDesktop
    const padding = isMobile ? mobilePadding : desktopPadding

    const {
      modalSecurity,
      isModalOpen,
      modalIconSrc
    } = this.state

    return (
      <div style={{
        padding,
        paddingRight: isDesktop ? 0 : padding
      }}>
        <Table inverted unstackable selectable style={table}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Symbol</Table.HeaderCell>
              <Table.HeaderCell textAlign="right">Price</Table.HeaderCell>
              {isMobile ? null : <Table.HeaderCell textAlign="right">24h</Table.HeaderCell>}
              {isMobile ? null : <Table.HeaderCell textAlign="right">7d</Table.HeaderCell>}
              <Table.HeaderCell textAlign="center">Balance</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Value</Table.HeaderCell>
              {isMobile ? null : <Table.HeaderCell textAlign="right">Supply</Table.HeaderCell>}
              {isMobile ? null : <Table.HeaderCell textAlign="right">Mkt Cap</Table.HeaderCell>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.getRows(this.props.securities)}
          </Table.Body>
        </Table>

        {/* modals */}

        <SecurityModal
          security={modalSecurity}
          isModalOpen={isModalOpen}
          iconSrc={modalIconSrc}
          onClose={this.closeSecurityModal}
          addManualTransaction={this.props.addManualTransaction}
          removeManualTransactions={this.props.removeManualTransactions}
          openBinanceSetupModal={this.openBinanceSetupModal}
          openEthereumSetupModal={this.openEthereumSetupModal}
        />

        <BinanceSetupModal
          isModalOpen={this.state.isBinanceSetupModalOpen}
          openBinanceSetupModal={this.openBinanceSetupModal}
        />

        <EthereumSetupModal
          isModalOpen={this.state.isEthereumSetupModalOpen}
          openEthereumSetupModal={this.openEthereumSetupModal}
        />
      </div>
    )
  }
}

Prices.propTypes = {
  addManualTransaction: PropTypes.func.isRequired,
  removeManualTransactions: PropTypes.func.isRequired,
  baseCurrency: PropTypes.string.isRequired,
  securities: PropTypes.array.isRequired,
  symbolOffset: PropTypes.number.isRequired,
  isFetching: PropTypes.bool,
  failureMessage: PropTypes.string,
  isMobile: PropTypes.bool,
  isDesktop: PropTypes.bool,
  setLastVisibleRow: PropTypes.func.isRequired
}

export default Prices
