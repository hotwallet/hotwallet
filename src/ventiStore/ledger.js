import LedgerSDK from 'ledger-sdk'
import { addWallet, fetchWalletBalances } from '../actions/wallets'
import { getSecurity } from '../selectors/securities'

import { state as ventiState } from 'venti'

export default ventiState.set('ledger', {
  data: null
})

export const setLedgerData = data => {
  console.log('setLedgerData, data --->>>', data)
  ventiState.set('ledger.data', data)
}

export const getLedgerSymbols = () => {
  return LedgerSDK.prototype.getSupportedSymbols()
}

export const startLedger = () => (dispatch, getState) => {
  const ledger = new LedgerSDK()
  const state = getState()

  // reset to disconnected status on start
  setLedgerData(null)

  ledger.on('open', data => {
    const security = getSecurity(state, data.symbol)
    setLedgerData(data)

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

  ledger.on('close', () => setLedgerData(null))

  ledger.on('disconnect', () => console.log('disconnect'))

  ledger.start().catch(error => setLedgerData({ error }))
}
