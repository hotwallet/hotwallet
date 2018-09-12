import React from 'react'
import { desktopPadding, mobilePadding } from '../lib/styles'
import { Dimmer, Loader, Image } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import EthereumSetupModal from './EthereumSetupModal'
import SecurityModal from './SecurityModal'
import 'react-virtualized/styles.css'
import { Table as VTable, WindowScroller, AutoSizer, Column } from 'react-virtualized'
import {
  formatFiat,
  roundToSignificantFigures,
  formatPercentChange,
  shortenLargeNumber
} from '../lib/formatNumber'
import './Prices.css'
import {subscribeSymbol} from '../lib/subscribe'

const PriceCell = subscribeSymbol(({security, delta24h, isMobile}) => (
  <React.Fragment>
    <div>{formatFiat(security.price, security.baseCurrency)}</div>
    {isMobile && (
      <div style={{
        ...delta24h.style,
        fontSize: 10,
        textAlign: 'right'
      }}>{delta24h.value}</div>
    )}
  </React.Fragment>
))

const ValueCell = subscribeSymbol(({balance, security, isMobile}) => (
  <React.Fragment>
    <div>{balance ? formatFiat(balance * security.price, security.baseCurrency) : '-'}</div>
    {isMobile && (
      <div style={{
        color: 'gray',
        fontSize: 10,
        textAlign: 'center',
        whiteSpace: 'nowrap'
      }}>{shortenLargeNumber(security.marketCap, security.baseCurrency)}
      </div>
    )}
  </React.Fragment>
))

const SupplyCell = subscribeSymbol(({security, price}) => (
  <div>{shortenLargeNumber(security.marketCap / security.price)}</div>
))

const MarketCapCell = subscribeSymbol(({security}) => (
  <div>{shortenLargeNumber(security.marketCap, security.baseCurrency)}</div>
))

class Prices extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
    this.closeSecurityModal = this.closeSecurityModal.bind(this)
    this.openSecurityModal = this.openSecurityModal.bind(this)
    this.getRow = this.getRow.bind(this)
  }

  openEthereumSetupModal = val => {
    this.setState({ isEthereumSetupModalOpen: val })
  }

  getRow = data => {
    return this.props.securities[data.index]
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

  getIcon(symbol) {
    const size = this.props.isMobile ? '16x16' : '32x32'
    return `https://chnnl.imgix.net/tarragon/icons/${size}/${symbol}.png`
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

    const symbolStyle = {
      fontSize: isMobile ? null : 18,
      verticalAlign: 'middle',
      display: isMobile ? 'block' : 'inline'
    }
    const rankStyle = {
      color: 'gray',
      marginRight: 10,
      fontSize: 10,
      position: isMobile ? 'absolute' : 'relative',
      left: isMobile ? 40 : 0
    }

    const headerStyle = {
      textTransform: 'none'
    }

    const balanceStyle = {
      cursor: 'pointer',
      width: isMobile ? '75px' : '100px',
      padding: '0.5em 1em',
      border: '2px solid rgb(73, 82, 90)',
      textAlign: 'center',
      margin: '0px auto'
    }

    function headerRenderer(style) {
      return ({
        columnData,
        dataKey,
        disableSort,
        label,
        sortBy,
        sortDirection
      }) => {
        return <div style={{...headerStyle, ...style}}> {label} </div>
      }
    }

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
                    overscanRowCount={10}
                    rowClassName="prices-row"
                    headerClassName="prices-header"
                    rowGetter={this.getRow}
                    rowCount={this.props.securities.length}
                    width={width}
                    height={height}
                    onScroll={onChildScroll}
                    isScrolling={isScrolling}
                    headerHeight={50}
                    rowHeight={60}
                    scrollTop={scrollTop}
                    tabIndex={null}>

                    <Column
                      flexGrow={isMobile ? 1 : 3}
                      label="Symbol"
                      width={isMobile ? 50 : 100}
                      headerRenderer={headerRenderer()}
                      dataKey="slug"
                      className="allow-overflow"
                      cellRenderer={
                        ({rowData: security, rowIndex}) => (
                          <a
                            style={{ color: '#fff' }}
                            href={`https://coinmarketcap.com/currencies/${security.slug}/`}
                          >
                            <span style={rankStyle}>{security.rank}</span>
                            <Image
                              src={this.getIcon(security.symbol)}
                              inline
                              verticalAlign="middle"
                              style={{ marginRight: 10 }}
                              width={isMobile ? 16 : 32}
                              height={isMobile ? 16 : 32}
                            />
                            <span style={symbolStyle}>{security.symbol}</span>
                          </a>
                        )
                      }
                    />

                    <Column
                      flexGrow={isMobile ? 1 : 2}
                      label="Price"
                      dataKey="price"
                      width={60}
                      headerRenderer={headerRenderer({textAlign: 'right'})}
                      style={{textAlign: 'right'}}
                      className="allow-overflow"
                      cellDataGetter={
                        ({rowData: security}) => {
                          return formatPercentChange(security.percentChange24h)
                        }
                      }
                      cellRenderer={
                        ({rowData: security, cellData: delta24h}) => (
                          <PriceCell symbol={security.symbol} security={security} delta24h={delta24h} isMobile={isMobile} />
                        )
                      }
                    />

                    {!isMobile && <Column
                      flexGrow={1}
                      label="24h"
                      dataKey="percentChange24h"
                      width={60}
                      headerRenderer={headerRenderer({textAlign: 'right'})}
                      style={{textAlign: 'right'}}
                      className="allow-overflow"
                      cellDataGetter={
                        ({dataKey, rowData: security}) => {
                          return formatPercentChange(security[dataKey])
                        }
                      }
                      cellRenderer={
                        ({cellData: delta24h}) => (
                          <div style={delta24h.style}> {delta24h.value} </div>
                        )
                      }
                    />}

                    {!isMobile && <Column
                      flexGrow={1}
                      label="7d"
                      dataKey="percentChange7d"
                      width={60}
                      headerRenderer={headerRenderer({textAlign: 'right'})}
                      style={{textAlign: 'right'}}
                      className="allow-overflow"
                      cellDataGetter={
                        ({dataKey, rowData: security}) => {
                          return formatPercentChange(security[dataKey])
                        }
                      }
                      cellRenderer={
                        ({cellData: delta7d}) => (
                          <div style={delta7d.style}> {delta7d.value} </div>
                        )
                      }
                    />}

                    <Column
                      flexGrow={1}
                      label="Balance"
                      dataKey="balance"
                      headerRenderer={headerRenderer({textAlign: 'center'})}
                      style={{textAlign: 'center'}}
                      className="allow-overflow"
                      width={isMobile ? 95 : 120}
                      minWidth={isMobile ? 95 : 120}
                      cellRenderer={
                        ({rowData: security}) => (
                          <div
                            onClick={() => {
                              this.openSecurityModal({
                                security: security,
                                iconSrc: this.getIcon(security.symbol)
                              })
                            }}
                            style={balanceStyle}>
                            {(security.balance >= 0) ? roundToSignificantFigures(security.balance) : '\u00A0'}
                          </div>
                        )
                      }
                    />

                    <Column
                      flexGrow={2}
                      label="Value"
                      dataKey="balance"
                      headerRenderer={headerRenderer({textAlign: 'center'})}
                      style={{textAlign: 'center'}}
                      width={60}
                      className="allow-overflow"
                      cellRenderer={
                        ({rowData: security, cellData: balance}) => (
                          <ValueCell security={security} balance={balance} symbol={security.symbol} isMobile={isMobile} />
                        )
                      }
                    />

                    {isDesktop && <Column
                      label="Supply"
                      dataKey="supply"
                      headerRenderer={headerRenderer({textAlign: 'right'})}
                      style={{textAlign: 'right', overflow: 'visible'}}
                      width={60}
                      className="allow-overflow"
                      cellRenderer={
                        ({rowData: security}) => (
                          <SupplyCell security={security} symbol={security.symbol} />
                        )
                      }
                    />}

                    {!isMobile && <Column
                      label="Mkt Cap"
                      dataKey="marketCap"
                      headerRenderer={headerRenderer({textAlign: 'right'})}
                      style={{textAlign: 'right'}}
                      className="allow-overflow"
                      width={60}
                      cellRenderer={
                        ({rowData: security}) => (
                          <MarketCapCell security={security} symbol={security.symbol} />
                        )
                      }
                    />}
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
          iconSrc={modalIconSrc}
          onClose={this.closeSecurityModal}
          addManualTransaction={this.props.addManualTransaction}
          removeManualTransactions={this.props.removeManualTransactions}
          openEthereumSetupModal={this.openEthereumSetupModal}
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
