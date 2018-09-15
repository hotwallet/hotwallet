import Promise from 'bluebird'
import client from '../lib/hotwalletClient'
import { addImportedTransaction } from './transactions'
import { getBalancesByWalletIdForSymbol } from '../selectors/transactions'

const fifteenMinutes = 1000 * 60 * 15

export const ADD_WALLET = 'ADD_WALLET'
export const SET_WALLET_SYNC_TIME = 'SET_WALLET_SYNC_TIME'

export const addWallet = wallet => ({ type: ADD_WALLET, wallet })

export const fetchWalletBalances = () => (dispatch, getState) => {
  const state = getState()
  const wallets = state.wallets
  Promise.map(Object.keys(wallets), walletId => {
    const wallet = wallets[walletId]
    if (!wallet.address && !wallet.xpub) return
    // TODO: iterate addresses and get total balance
    if (wallet.xpub) return
    // don't check balance more than once every five minutes
    if (wallet.lastSync + fifteenMinutes > Date.now()) return
    const url = `/addresses/${wallet.symbol}/${wallet.address}`
    return client.get(url)
      .then(response => {
        if (!Array.isArray(response.balances)) return
        dispatch({
          type: SET_WALLET_SYNC_TIME,
          wallet
        })
        response.balances.forEach(tx => {
          const { symbol, balance } = tx
          // don't add a new transaction if the balance hasn't changed
          const balances = getBalancesByWalletIdForSymbol(state, symbol) || {}
          if (balances[walletId] === balance) return
          addImportedTransaction({ symbol, balance, walletId })(dispatch, getState)
        })
      })
  })
}
