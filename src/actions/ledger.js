import LedgerSDK from 'ledger-sdk'
import { addWallet } from './wallets'
import { getSecurity } from '../selectors/securities'

export const SET_LEDGER_DATA = 'SET_LEDGER_DATA'

export const setLedgerData = data => ({
  type: SET_LEDGER_DATA,
  data
})

export const startLedger = () => (dispatch, getState) => {
  const ledger = new LedgerSDK()
  const state = getState()

  // reset to disconnected status on start
  dispatch(setLedgerData(null))

  ledger.on('open', data => {
    const security = getSecurity(state, data.symbol)
    dispatch(setLedgerData(data))
    dispatch(addWallet({
      name: `My ${security.name} Wallet`,
      symbol: data.symbol,
      xpub: data.xpub,
      isSegwit: false,
      isLedgerWallet: true
    }))
  })

  ledger.on('close', () => dispatch(setLedgerData(null)))

  ledger.on('disconnect', () => console.log('disconnect'))

  ledger.start()
}
