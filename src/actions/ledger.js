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
    const security = getSecurity(state, data.symbol)
    dispatch(setLedgerData(data))

    const wallets = []

    if (data.legacy) {
      wallets.push({
        name: `${security.name} Ledger Wallet`,
        symbol: data.symbol,
        xpub: data.legacy.xpub,
        isSegwit: false,
        isLedgerWallet: true
      })
    }

    if (data.segwit) {
      wallets.push({
        name: `${security.name} Ledger Wallet`,
        symbol: data.symbol,
        xpub: data.segwit.xpub,
        isSegwit: true,
        isLedgerWallet: true
      })
    }

    if (data.xpub) {
      wallets.push({
        name: `${security.name} Ledger Wallet`,
        symbol: data.symbol,
        xpub: data.xpub,
        isLedgerWallet: true
      })
    }

    if (wallets.length === 0 && data.address) {
      wallets.push({
        name: `${security.name} Ledger Wallet`,
        symbol: data.symbol,
        address: data.address,
        isLedgerWallet: true
      })
    }

    let newWallets = 0
    wallets.forEach(wallet => {
      const alreadyExists = Object.keys(state.wallets).find(walletId => {
        let exists = false
        if (walletId === `${wallet.symbol}:${wallet.xpub}`) exists = true
        if (walletId === `${wallet.symbol}:${wallet.address}`) exists = true
        return exists
      })
      if (!alreadyExists) {
        newWallets += 1
        dispatch(addWallet(wallet))
      }
    })

    if (newWallets > 0) {
      fetchWalletBalances()(dispatch, getState)
    }
  })

  ledger.on('close', () => dispatch(setLedgerData(null)))

  ledger.on('disconnect', () => console.log('disconnect'))

  ledger.start()
}
