import BinanceClient from '../lib/BinanceClient'
import { addImportedTransaction } from '../actions/transactions'
import { getBalanceForSymbol, getBalancesForWallet } from '../selectors/transactions'
import { state } from 'venti'

export default state.set({
  apiKey: '',
  secretKey: '',
  lastSync: null,
  binanceErrorMessage: ''
})

const fiveMinutes = 1000 * 60 * 5

export const createApiKeyUrl = 'https://www.binance.com/userCenter/createApi.html'

export const setBinanceApiKeys = (keys) => {
  console.log('setBinanceApiKeys, keys.apiKey --->>>', keys.apiKey)
  console.log('setBinanceApiKeys, app to add --->>>', keys.secretKey)
  state.set('apiKey', keys.apiKey)
  state.set('secretKey', keys.secretKey)
}

const setLastSync = () => {
  const lastSync = state.get(`lastSync`, [])
  console.log('setLastSync, lastSync --->>>', lastSync)
  state.set('lastSync', Date.now())
}

const setBinanceErrorMessage = (errorMessage) => {
  const binanceErrorMessage = state.get(`binanceErrorMessage`, [])
  console.log('setBinanceErrorMessage, binanceErrorMessage --->>>', binanceErrorMessage)
  state.set('binanceErrorMessage', errorMessage)
}

export const fetchBinanceBalances = () => (dispatch) => {
  const apiKey = state.get(`apiKey`, '')
  const secretKey = state.get(`secretKey`, '')
  console.log('apiKey', apiKey)
  console.log('secretKey', secretKey)
  if (!apiKey || !secretKey) return
  // don't check binance balance too often
  const age = Date.now() - state.binance.lastSync
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
          })(dispatch)
        }
      })
    })
    .catch(errorMessage => {
      setBinanceErrorMessage(errorMessage)
    })
}

export const zeroBinanceBalances = () => (dispatch) => {
  const walletId = 'Binance'
  const balances = getBalancesForWallet(state, walletId)
  Object.keys(balances).forEach(symbol => {
    const balance = balances[symbol]
    if (!balance) return
    addImportedTransaction({
      symbol,
      balance: 0,
      walletId
    })(dispatch)
  })
}
