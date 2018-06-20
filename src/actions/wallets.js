import Promise from 'bluebird'
import EthereumClient from '../lib/EthereumClient'
import { addImportedTransaction } from './transactions'

export const ADD_WALLET = 'ADD_WALLET'
export const SET_WALLET_SYNC_TIME = 'SET_WALLET_SYNC_TIME'

export const addWallet = wallet => ({ type: ADD_WALLET, wallet })

export const fetchWalletBalances = () => (dispatch, getState) => {
  const state = getState()
  const wallets = state.wallets
  const client = new EthereumClient()
  Promise.map(Object.keys(wallets), walletId => {
    const wallet = wallets[walletId]
    return client.getBalances(wallet.address)
      .then(tokenBalances => {
        dispatch({
          type: SET_WALLET_SYNC_TIME,
          wallet
        })
        tokenBalances.forEach(tx => {
          addImportedTransaction({
            symbol: tx.symbol,
            balance: tx.balance,
            walletId
          })(dispatch, getState)
        })
      })
  })
}
