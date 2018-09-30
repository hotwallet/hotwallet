import BinanceClient from '../lib/BinanceClient'
import { addImportedTransaction } from './transactions'
import { getBalanceForSymbol, getBalancesForWallet } from '../selectors/transactions'

export const SET_BINANCE_API_KEYS = 'SET_BINANCE_API_KEYS'
export const SET_BINANCE_SYNC_TIME = 'SET_BINANCE_SYNC_TIME'
export const SET_BINANCE_ERROR_MESSAGE = 'SET_BINANCE_ERROR_MESSAGE'

const fiveMinutes = 1000 * 60 * 5

export const createApiKeyUrl = 'https://www.binance.com/userCenter/createApi.html'

export const setBinanceApiKeys = (keys) => ({ type: SET_BINANCE_API_KEYS, keys })

export const fetchBinanceBalances = () => (dispatch, getState) => {
  const state = getState()
  const { apiKey, secretKey } = state.binance
  if (!apiKey || !secretKey) return
  // don't check binance balance too often
  const age = Date.now() - state.binance.lastSync
  if (age < fiveMinutes) return
  const binance = new BinanceClient(apiKey, secretKey)
  binance.getAccount()
    .then(data => {
      dispatch({
        type: SET_BINANCE_SYNC_TIME
      })
      dispatch({
        type: SET_BINANCE_ERROR_MESSAGE,
        errorMessage: ''
      })
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
          })(dispatch, getState)
        }
      })
    })
    .catch(err => {
      dispatch({
        type: SET_BINANCE_ERROR_MESSAGE,
        errorMessage: err
      })
    })
}

export const zeroBinanceBalances = () => (dispatch, getState) => {
  const state = getState()
  const walletId = 'Binance'
  const balances = getBalancesForWallet(state, walletId)
  Object.keys(balances).forEach(symbol => {
    const balance = balances[symbol]
    if (!balance) return
    addImportedTransaction({
      symbol,
      balance: 0,
      walletId
    })(dispatch, getState)
  })
}
