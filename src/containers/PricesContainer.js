import React from 'react'
import moment from 'moment'
import debounce from 'lodash.debounce'
import Prices from '../components/Prices'
import { accountService, assetService } from '../services'
import { compose, withTheme } from '../contexts'
import { connectAccounts, connectAssets } from '../db'

class PricesContainer extends React.Component {
  componentDidMount() {
    // fetch all prices if they haven't been updated in the past hour
    const updatedAt = this.props.updatedAt
    const diff = moment().diff(updatedAt, 'hours')
    if (!updatedAt || diff > 1 || this.props.failureMessage) {
      assetService.importAssets()
    }
  }

  render() {
    if (!this.props.assets) {
      return <div>Loading assets...</div>
    }
    return React.createElement(Prices, {
      addManualTransaction: this.props.addManualTransaction,
      removeManualTransactions: this.props.removeManualTransactions,
      securities: this.props.assets,
      symbolOffset: this.props.symbolOffset,
      isFetching: this.props.isFetching,
      failureMessage: this.props.failureMessage,
      isMobile: this.props.isMobile,
      isDesktop: this.props.isDesktop,
      baseCurrency: this.props.baseCurrency,
      setLastVisibleRow: this.props.setLastVisibleRow
    })
  }
}

const withPrimaryAccount = connectAccounts(
  () => ({ primaryAccount: accountService.getPrimaryAccount() }),
  (change, props) => change.affects({ isPrimary: true })
)

const withAssets = (() => {
  let gettingData = false
  const getData = async () => {
    if (gettingData) return
    gettingData = true
    const assets = await assetService.getAssets()
    gettingData = false
    return { assets }
  }
  const shouldUpdate = (change, props) => change.toggles('showBlankBalances') || change.toggles('balance')
  return compose(
    connectAccounts(getData, shouldUpdate),
    connectAssets(getData, shouldUpdate)
  )
})()

export default compose(
  withPrimaryAccount,
  withAssets,
  withTheme
)(PricesContainer)

// const mapStateToProps = (state, props) => {
//   return ({
//     // updatedAt: state.securities.metadata.updatedAt,
//     baseCurrency: state.user.baseCurrency,
//     securities: getVisibleSecurities(state, props),
//     symbolOffset: state.ephemeral.rowSlice[0] || 0,
//     isFetching: state.securities.metadata.isFetching,
//     failureMessage: state.securities.metadata.failureMessage,
//     isMobile: state.ephemeral.isMobile,
//     isDesktop: state.ephemeral.isDesktop
//   })
// }

// export default connect(mapStateToProps, mapDispatchToProps)(PricesContainer)
