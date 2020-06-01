import BinanceClient from '../lib/BinanceClient'
import { addImportedTransaction } from './transactions'
import { getBalanceForSymbol, getBalancesForWallet } from '../ventiSelectors/transactions'
import { state } from 'venti'

const fiveMinutes = 1000 * 60 * 5

export const createApiKeyUrl = 'https://www.binance.com/userCenter/createApi.html'

export const setBinanceApiKeys = (keys) => {
  console.log('setBinanceApiKeys, keys.apiKey --->>>', keys.apiKey)
  console.log('setBinanceApiKeys, app to add --->>>', keys.secretKey)
  state.set('binance.apiKey', keys.apiKey)
  state.set('binance.secretKey', keys.secretKey)
}

const setLastSync = () => {
  const lastSync = state.get(`binance.lastSync`, [])
  console.log('setLastSync, lastSync --->>>', lastSync)
  state.set('binance.lastSync', Date.now())
}

const setBinanceErrorMessage = (errorMessage) => {
  const binanceErrorMessage = state.get(`binance.binanceErrorMessage`, [])
  console.log('setBinanceErrorMessage, binanceErrorMessage --->>>', binanceErrorMessage)
  state.set('binance.binanceErrorMessage', errorMessage)
}

export const fetchBinanceBalances = () => {
  const apiKey = state.get(`binance.apiKey`, '')
  const secretKey = state.get(`binance.secretKey`, '')
  const lastSync = state.get(`binance.lastSync`, [])
  console.log('apiKey', apiKey)
  console.log('secretKey', secretKey)
  if (!apiKey || !secretKey) return
  // don't check binance balance too often
  const age = Date.now() - lastSync
  if (age < fiveMinutes) return
  const binance = new BinanceClient(apiKey, secretKey)
  binance.getAccount()
    .then(data => {
      setLastSync()
      setBinanceErrorMessage()
      data.balances.forEach(row => {
        const symbol = row.asset
        const newBalance = Number(row.free) + Number(row.locked)
        const oldBalance = getBalanceForSymbol(state, symbol)
        if (newBalance !== oldBalance) {
          if (newBalance === 0 && oldBalance === undefined) return
          addImportedTransaction({
            symbol,
            balance: newBalance,
            walletId: 'Binance'
          })
        }
      })
    })
    .catch(errorMessage => {
      setBinanceErrorMessage(errorMessage)
    })
}

export const zeroBinanceBalances = () => {
  const walletId = 'Binance'
  const balances = getBalancesForWallet(state, walletId)
  Object.keys(balances).forEach(symbol => {
    const balance = balances[symbol]
    if (!balance) return
    addImportedTransaction({
      symbol,
      balance: 0,
      walletId
    })
  })
}
