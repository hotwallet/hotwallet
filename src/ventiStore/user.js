import { fetchSecurities } from './securities'
import { clearPrices } from './prices'
import { refreshChart } from './portfolio'
import client from '../lib/hotwalletClient'
import { state } from 'venti'

export const setBaseCurrency = currency => {
  const baseCurrency = state.get(`user.baseCurrency`, '')
  const originalCurrency = baseCurrency

  if (currency !== originalCurrency) {
    clearPrices()

    state.set('user.baseCurrency', currency)

    client.socket.syncSubscriptions()

    refreshChart()
    fetchSecurities()
  }
}
