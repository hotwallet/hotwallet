import LedgerSDK from 'ledger-sdk'
import { addWallet, fetchWalletBalances } from './wallets'
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
    console.log('open', data)
    const security = getSecurity(state, data.symbol)
    dispatch(setLedgerData(data))
    const wallet = {
      name: `${security.name} Ledger Wallet`,
      symbol: data.symbol,
      xpub: data.xpub,
      isSegwit: false,
      isLedgerWallet: true
    }
    if (!wallet.xpub) {
      wallet.address = data.address
    }
    const alreadyExists = Object.keys(state.wallets).find(walletId => {
      let exists = false
      if (walletId === `${wallet.symbol}:${wallet.xpub}`) exists = true
      if (walletId === `${wallet.symbol}:${wallet.address}`) exists = true
      return exists
    })
    if (!alreadyExists) {
      dispatch(addWallet(wallet))
      fetchWalletBalances()(dispatch, getState)
    }
  })

  ledger.on('close', () => dispatch(setLedgerData(null)))

  ledger.on('disconnect', () => console.log('disconnect'))

  ledger.start()
}
