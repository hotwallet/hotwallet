import React, { useEffect } from 'react'
import { getVisibleSecurities } from '../ventiSelectors/securities'
import { fetchSecurities } from '../ventiStore/securities'
import { addManualTransaction, removeManualTransactions } from '../ventiStore/transactions'
import moment from 'moment'
import Prices from '../components/Prices'
import { withTheme, compose } from '../contexts'
// import api from '../api'
import { useVenti } from 'venti'
import { setLastVisibleRow } from '../ventiStore/ephemeral'

function PricesContainer({
  isMobile,
  isDesktop,
  updatedAt
}) {
  useEffect(() => {
    // fetch all prices if they haven't been updated in the past hour
    const diff = moment().diff(updatedAt, 'hours')
    if (!updatedAt || diff > 1 || failureMessage) {
      fetchSecurities()
    }
  })

  const state = useVenti()
  const baseCurrency = state.get(`user.baseCurrency`, '')
  const securities = getVisibleSecurities()
  const symbolOffset = state.get(`ephemeral.rowSlice`, [])[0] || 0
  const isFetching = state.get(`securities.metadata.isFetching`, false)
  const failureMessage = state.get(`securities.metadata.failureMessage`, '')
  const props = {
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
  }
  return (<Prices {...props} />)
}

export default compose(
  withTheme
)(PricesContainer)
