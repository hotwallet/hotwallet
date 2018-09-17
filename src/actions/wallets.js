import Promise from 'bluebird'
import client from '../lib/hotwalletClient'
import { addImportedTransaction } from './transactions'
import { getBalancesByWalletIdForSymbol } from '../selectors/transactions'
import { deriveAddress } from 'xpubjs'

const fifteenMinutes = 1000 * 60 * 15
const gapLimit = 10

export const ADD_WALLET = 'ADD_WALLET'
export const SET_WALLET_SYNC_TIME = 'SET_WALLET_SYNC_TIME'

export const addWallet = wallet => ({ type: ADD_WALLET, wallet })

const getBalances = (symbol, address) => {
  const url = `/addresses/${symbol}/${address}`
  return client.get(url)
    .then(response => {
      if (!Array.isArray(response.balances)) return []
      return response.balances
    })
    .catch(err => {
      return []
    })
}

const getChainBalances = (symbol, xpub, change, index = 0, totals = {}, unused = 0) => {
  const path = `${change}/${index}`
  const address = deriveAddress({ symbol, xpub, path })
  return getBalances(symbol, address)
    .then(balances => {
      const newTotals = {...totals}
      balances.forEach(row => {
        const total = totals[row.symbol] || 0
        // TODO: safe math
        newTotals[row.symbol] = total + Number(row.balance)
      })
      if (unused > gapLimit) {
        return Object.keys(newTotals).map(sym => ({
          symbol: sym,
          balance: totals[sym]
        }))
      }
      return Promise.delay(50)
        .then(() => getChainBalances(symbol, xpub, change, index + 1, newTotals, unused + 1))
    })
}

const getHDBalances = (symbol, xpub) => {
  return Promise.props({
    receive: getChainBalances(symbol, xpub, 0),
    change: getChainBalances(symbol, xpub, 1)
  })
    .then(results => {
      console.log('results:', results)
      // TODO: add together the receive and change balances
      return []
    })
}

export const fetchWalletBalances = () => (dispatch, getState) => {
  const state = getState()
  const wallets = state.wallets
  Promise.map(Object.keys(wallets), walletId => {
    const wallet = wallets[walletId]
    const { symbol, address, xpub, lastSync } = wallet
    if (!address && !xpub) return
    // don't check wallet balance too often
    if (lastSync + fifteenMinutes > Date.now()) return
    dispatch({
      type: SET_WALLET_SYNC_TIME,
      wallet
    })
    return Promise.resolve()
      .then(() => {
        // TODO: iterate addresses and get total balance
        if (xpub) return getHDBalances(symbol, xpub)
        return getBalances(symbol, address)
      })
      .then(balances => {
        // save balances
        balances.forEach(row => {
          // don't add a new transaction if the balance hasn't changed
          const balances = getBalancesByWalletIdForSymbol(state, row.symbol) || {}
          if (balances[walletId] === row.balance) return
          addImportedTransaction({
            symbol,
            balance: row.balance,
            walletId
          })(dispatch, getState)
        })
      })
  })
}
