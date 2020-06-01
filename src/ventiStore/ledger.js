import LedgerSDK from 'ledger-sdk'
import { addWallet, fetchWalletBalances } from './wallets'
import { getSecurity } from '../ventiSelectors/securities'

import { state } from 'venti'

export const setLedgerData = data => {
  console.log('setLedgerData, data --->>>', data)
  state.set('ledger.data', data)
}

export const getLedgerSymbols = () => {
  return LedgerSDK.prototype.getSupportedSymbols()
}

export const startLedger = () => {
  const ledger = new LedgerSDK()

  // reset to disconnected status on start
  setLedgerData(null)

  ledger.on('open', data => {
    const security = getSecurity(data.symbol)
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
      const alreadyExists = Object.keys(state.get('wallets', {})).find(walletId => {
        let exists = false
        if (walletId === `${wallet.symbol}:${wallet.xpub}`) exists = true
        if (walletId === `${wallet.symbol}:${wallet.address}`) exists = true
        return exists
      })
      if (!alreadyExists) {
        newWallets += 1
        addWallet(wallet)
      }
    })

    if (newWallets > 0) {
      fetchWalletBalances()
    }
  })

  ledger.on('close', () => setLedgerData(null))

  ledger.on('disconnect', () => console.log('disconnect'))

  ledger.start().catch(error => setLedgerData({ error }))
}
