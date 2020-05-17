import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { getVisibleSecurities } from '../selectors/securities'
import moment from 'moment'
import Prices from '../components/Prices'
import { withTheme, compose } from '../contexts'
import { withState } from '../ventiStore'
// import api from '../api'
import { useVenti } from 'venti'

function PricesContainer({
  addManualTransaction,
  removeManualTransactions,
  securities,
  symbolOffset,
  isFetching,
  failureMessage,
  isMobile,
  isDesktop,
  setLastVisibleRow,
  updatedAt,
  fetchSecurities
}) {
  useEffect(() => {
    // fetch all prices if they haven't been updated in the past hour
    const diff = moment().diff(updatedAt, 'hours')
    if (!updatedAt || diff > 1 || failureMessage) {
      fetchSecurities()
    }
  }, [])

  const state = useVenti()
  const baseCurrency = state.get(`user.baseCurrency`, '')

  return React.createElement(Prices, {
    addManualTransaction,
    removeManualTransactions,
    securities,
    symbolOffset,
    isFetching,
    failureMessage,
    isMobile,
    isDesktop,
    baseCurrency,
    setLastVisibleRow
  })
}

const mapStateToProps = (state, props) => {
  return ({
    // updatedAt: state.securities.metadata.updatedAt,
    securities: getVisibleSecurities(state, props),
    symbolOffset: state.ephemeral.rowSlice[0] || 0,
    isFetching: state.securities.metadata.isFetching,
    failureMessage: state.securities.metadata.failureMessage
  })
}

const getProps = (state, props) => ({
  // securities: api(state).getAssets()
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withTheme,
  withState(getProps)
)(PricesContainer)
