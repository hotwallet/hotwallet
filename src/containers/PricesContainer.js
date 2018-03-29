import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { getVisibleSecurities } from '../selectors/securitiesSelectors'
import moment from 'moment'
import Prices from '../components/Prices'

class PricesContainer extends React.Component {
  componentDidMount() {
    // fetch all prices if they haven't been updated in the past 2 minutes
    const updatedAt = this.props.updatedAt
    const diff = moment().diff(updatedAt, 'seconds')
    if (!updatedAt || diff > 120 || this.props.failureMessage) {
      this.props.fetchSecurities()
    }
  }

  render() {
    return React.createElement(Prices, { ...this.props })
  }
}

const mapStateToProps = (state, props) => ({
  updatedAt: state.securities.updatedAt,
  baseCurrency: state.user.baseCurrency,
  securities: getVisibleSecurities(state, props),
  isFetching: state.securities.isFetching,
  failureMessage: state.securities.failureMessage,
  balancesOnly: state.securities.balancesOnly,
  transactions: state.transactions,
  isMobile: state.app.isMobile,
  isDesktop: state.app.isDesktop,
  query: state.app.filterSymbolsQuery
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesContainer)
