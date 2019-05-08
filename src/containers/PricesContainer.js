import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { getVisibleSecurities } from '../selectors/securities'
import moment from 'moment'
import Prices from '../components/Prices'

class PricesContainer extends React.Component {
  componentDidMount() {
    // fetch all prices if they haven't been updated in the past hour
    const updatedAt = this.props.updatedAt
    const diff = moment().diff(updatedAt, 'hours')
    if (!updatedAt || diff > 1 || this.props.failureMessage) {
      this.props.fetchSecurities()
    }
  }

  render() {
    return React.createElement(Prices, {
      addManualTransaction: this.props.addManualTransaction,
      removeManualTransactions: this.props.removeManualTransactions,
      securities: this.props.securities,
      symbolOffset: this.props.symbolOffset,
      isFetching: this.props.isFetching,
      failureMessage: this.props.failureMessage,
      isMobile: this.props.isMobile,
      isDesktop: this.props.isDesktop,
      baseCurrency: this.props.baseCurrency,
      setLastVisibleRow: this.props.setLastVisibleRow,
      history: this.props.history
    })
  }
}

const mapStateToProps = (state, ownProps) => {
  return ({
    // updatedAt: state.securities.metadata.updatedAt,
    baseCurrency: state.user.baseCurrency,
    securities: getVisibleSecurities(state, ownProps),
    symbolOffset: state.ephemeral.rowSlice[0] || 0,
    isFetching: state.securities.metadata.isFetching,
    failureMessage: state.securities.metadata.failureMessage,
    isMobile: state.ephemeral.isMobile,
    isDesktop: state.ephemeral.isDesktop,
    history: ownProps.history
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(PricesContainer)
