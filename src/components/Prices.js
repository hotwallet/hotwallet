import React from 'react'
import { desktopPadding, mobilePadding } from '../lib/styles'
import { Dimmer, Loader, Image } from 'semantic-ui-react'
import PricesRow from './PricesRow'
import PropTypes from 'prop-types'
import BinanceSetupModal from './BinanceSetupModal'
import SecurityModal from './SecurityModal'
import 'react-virtualized/styles.css'
import { Table as VTable, WindowScroller, AutoSizer, Column } from 'react-virtualized'
import {
  formatFiat,
  roundToSignificantFigures
} from '../lib/formatNumber'

class Prices extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isBinanceSetupModalOpen: false
    }
    this.openBinanceSetupModal = this.openBinanceSetupModal.bind(this)
    this.closeSecurityModal = this.closeSecurityModal.bind(this)
    this.openSecurityModal = this.openSecurityModal.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.getRow = this.getRow.bind(this)
    this.getSecurityIcon = this.getSecurityIcon.bind(this)
    this.getIcon = this.getIcon.bind(this)
  }

  formatPrice(num) {
    return formatFiat(num, this.props.baseCurrency)
  }

  openBinanceSetupModal(val) {
    this.setState({ isBinanceSetupModalOpen: val })
  }

  rowRenderer({index, isScrolling, isVisible, key, style}) {
    const security = this.props.securities[index]
    return (
      <PricesRow key={security.symbol}
        rowIndex={index + this.props.symbolOffset}
        security={security}
        setLastVisibleRow={this.props.setLastVisibleRow}
        addManualTransaction={this.props.addManualTransaction}
        baseCurrency={this.props.baseCurrency}
        isMobile={this.props.isMobile}
        openBinanceSetupModal={this.openBinanceSetupModal}
        openSecurityModal={this.openSecurityModal}
      />
    )
  }

  getRow(data) {
    return this.props.securities[data.index]
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
      />
    ))
  }

  closeSecurityModal() {
    this.setState({isModalOpen: false})
  }

  openSecurityModal({security, getSecurityIcon}) {
    this.setState({
      isModalOpen: true,
      modalSecurity: security,
      modalGetSecurityIcon: getSecurityIcon
    })
  }

  getIcon(symbol) {
    const size = this.props.isMobile ? '16x16' : '32x32'
    return `https://chnnl.imgix.net/tarragon/icons/${size}/${symbol}.png`
  }

  getSecurityIcon({ security, label, isModal }) {
    // TODO: use security.rank instead of rowIndex
    const rank = 1 // this.props.rowIndex + 1
    const isMobileRow = this.props.isMobile && !isModal
    const symbolStyle = {
      fontSize: isMobileRow ? null : 18,
      verticalAlign: 'middle',
      display: isMobileRow ? 'block' : 'inline'
    }
    const rankStyle = {
      color: 'gray',
      marginRight: 10,
      fontSize: 10
    }
    if (isMobileRow) {
      rankStyle.position = 'absolute'
      rankStyle.left = 50
    }
    return (
      <div>
        <span style={rankStyle}>
          {rank}
        </span>
        <Image
          src={this.getIcon(security.symbol)}
          inline
          verticalAlign="middle"
          style={isMobileRow ? { marginLeft: 6 } : { marginRight: 12 }}
        />
        <span style={symbolStyle}>
          {label}
        </span>
      </div>
    )
  }

  getCMCHref(security) {
    return `https://coinmarketcap.com/currencies/${security.slug}/`
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
      modalGetSecurityIcon
    } = this.state

    return (
      <div style={{
        padding,
        paddingRight: isDesktop ? 0 : padding
      }}>
        <WindowScroller
          scrollElement={window}>
          {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
            <AutoSizer disableHeight>
              {({width}) => (
                <div ref={registerChild}>
                  <VTable
                    autoHeight
                    // className="inverted unstackable selectable"
                    // style={table}
                    overscanRowCount={75}
                    rowClassName="asdr"
                    headerClassName="asdh"
                    rowGetter={this.getRow}
                    rowCount={this.props.securities.length}
                    width={width}
                    height={height}
                    rowHeight={50}
                    onScroll={onChildScroll}
                    isScrolling={isScrolling}
                    headerHeight={32}
                    scrollTop={scrollTop}>

                    <Column
                      flexGrow={1}

                      label="Symbol"
                      dataKey="name"
                      width={60}
                      cellRenderer={
                        ({rowData}) => (
                          <a
                            style={{ color: '#fff' }}
                            href={this.getCMCHref(rowData)}
                          >
                            {this.getSecurityIcon({ security: rowData, label: rowData.symbol })}
                          </a>
                        )
                      }
                    />

                    <Column
                      flexGrow={1}

                      label="Price"
                      dataKey="price"
                      width={60}
                      cellRenderer={
                        ({rowData}) => (
                          this.formatPrice(rowData.price)
                        )
                      }
                    />

                    <Column
                      flexGrow={1}

                      label="Amount"
                      dataKey="amount"
                      width={60}
                      cellRenderer={
                        ({rowData}) => (
                          <div
                            onClick={() => {
                              this.openSecurityModal({
                                security: rowData,
                                getSecurityIcon: this.getSecurityIcon
                              })
                            }}
                            style={{
                              cursor: 'pointer',
                              width: isMobile ? 80 : 100,
                              padding: '0.5em 1em',
                              border: `2px solid lightblue`,
                              textAlign: 'center'
                              // margin: '0 auto'
                            }}>{(rowData.balance >= 0) ? roundToSignificantFigures(rowData.balance) : '\u00A0'}</div>
                        )
                      }
                    />
                  </VTable>
                </div>
              )}
            </AutoSizer>
          )}
        </WindowScroller>
        {/* Plugins */}
        <SecurityModal
          security={modalSecurity}
          isModalOpen={isModalOpen}
          getSecurityIcon={modalGetSecurityIcon}
          onClose={this.closeSecurityModal}
          addManualTransaction={this.props.addManualTransaction}
          removeManualTransactions={this.props.removeManualTransactions}
          openBinanceSetupModal={this.openBinanceSetupModal}
        />
        <BinanceSetupModal
          isModalOpen={this.state.isBinanceSetupModalOpen}
          openBinanceSetupModal={this.openBinanceSetupModal}
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
