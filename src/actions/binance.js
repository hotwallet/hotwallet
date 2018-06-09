// TODO: use a more lightweight library
import Binance from 'binance'
import { addBinanceTransaction } from './transactions'

export const SET_BINANCE_API_KEYS = 'SET_BINANCE_API_KEYS'
export const SET_BINANCE_SYNC_TIME = 'SET_BINANCE_SYNC_TIME'

export const createApiKeyUrl = 'https://www.binance.com/userCenter/createApi.html'

export const setBinanceApiKeys = (keys) => ({ type: SET_BINANCE_API_KEYS, keys })

export const fetchBinanceBalances = () => (dispatch, getState) => {
  const { apiKey, secretKey } = getState().binance
  if (!apiKey || !secretKey) return
  const binance = new Binance.BinanceRest({
    key: apiKey,
    secret: secretKey,
    recvWindow: 10000
  })
  binance._baseUrl = 'https://cors-anywhere.herokuapp.com/https://api.binance.com/'
  binance.account()
    .then(data => {
      dispatch({
        type: SET_BINANCE_SYNC_TIME
      })
      data.balances.forEach(row => {
        const balance = Number(row.free) + Number(row.locked)
        const symbol = row.asset
        // TODO: only add the binance transaction if the balance has changed
        if (balance > 0) {
          addBinanceTransaction({
            symbol,
            balance
          })(dispatch, getState)
        }
      })
    })
}
