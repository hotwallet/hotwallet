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
    return React.createElement(Prices, {
      addTransaction: this.props.addTransaction,
      securities: this.props.securities,
      isFetching: this.props.isFetching,
      failureMessage: this.props.failureMessage,
      isMobile: this.props.isMobile,
      isDesktop: this.props.isDesktop,
      baseCurrency: this.props.baseCurrency
    })
  }
}

// Unrequired?
// PricesContainer.propTypes = {
//   updatedAt: PropTypes.string,
//   baseCurrency: PropTypes.string.isRequired,
//   securities: PropTypes.array.isRequired,
//   isFetching: PropTypes.bool,
//   failureMessage: PropTypes.string,
//   balancesOnly: PropTypes.bool,
//   transactions: PropTypes.array.isRequired,
//   isMobile: PropTypes.bool,
//   isDesktop: PropTypes.bool,
//   query: PropTypes.string
// }

const mapStateToProps = (state, props) => ({
  updatedAt: state.securities.metadata.updatedAt,
  baseCurrency: state.user.baseCurrency,
  securities: getVisibleSecurities(state, props),
  isFetching: state.securities.metadata.isFetching,
  failureMessage: state.securities.metadata.failureMessage,
  isMobile: state.app.isMobile,
  isDesktop: state.app.isDesktop
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesContainer)
