import BinanceClient from '../lib/BinanceClient'
import { addImportedTransaction } from './transactions'
import { getBalanceForSymbol } from '../selectors/transactions'

export const SET_BINANCE_API_KEYS = 'SET_BINANCE_API_KEYS'
export const SET_BINANCE_SYNC_TIME = 'SET_BINANCE_SYNC_TIME'

export const createApiKeyUrl = 'https://www.binance.com/userCenter/createApi.html'

export const setBinanceApiKeys = (keys) => ({ type: SET_BINANCE_API_KEYS, keys })

export const fetchBinanceBalances = () => (dispatch, getState) => {
  const state = getState()
  const { apiKey, secretKey } = state.binance
  if (!apiKey || !secretKey) return
  const binance = new BinanceClient(apiKey, secretKey)
  binance.getAccount()
    .then(data => {
      dispatch({
        type: SET_BINANCE_SYNC_TIME
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
}
