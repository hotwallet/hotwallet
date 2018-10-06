import Promise from 'bluebird'
import Big from 'big.js'
import client from '../lib/hotwalletClient'
import { addImportedTransaction, removeTransactions } from './transactions'
import { getBalancesByWalletIdForSymbol, getTransactionsForWallet } from '../selectors/transactions'
import { deriveAddress } from 'xpubjs'

const fifteenMinutes = 1000 * 60 * 15
const gapLimit = 10

export const ADD_WALLET = 'ADD_WALLET'
export const DELETE_WALLET = 'DELETE_WALLET'
export const SET_WALLET_SYNC_TIME = 'SET_WALLET_SYNC_TIME'
export const SET_WALLET_NAME = 'SET_WALLET_NAME'

export const addWallet = wallet => ({ type: ADD_WALLET, wallet })

export const deleteWallet = id => (dispatch, getState) => {
  const state = getState()
  dispatch({ type: DELETE_WALLET, id })
  const txs = getTransactionsForWallet(state, id) || []
  const txIds = txs.map(tx => tx.id)
  removeTransactions(txIds)(dispatch, getState)
}

export const setWalletName = (id, name) => ({ type: SET_WALLET_NAME, id, name })

const getBalances = (symbol, address) => {
  const url = `/addresses/${symbol}/${address}`
  return client.get(url)
    .then(response => {
      if (!Array.isArray(response.balances)) return []
      return response.balances
    })
}

const getChainBalances = (symbol, xpub, change, index = 0, totals = {}, unused = 0) => {
  const path = `${change}/${index}`
  const address = deriveAddress({ symbol, xpub, path })
  return getBalances(symbol, address)
    .then(balances => {
      const newTotals = { ...totals }
      let isUnused = true
      balances.forEach(row => {
        const total = Big(totals[row.symbol] || 0)
        newTotals[row.symbol] = total.add(row.balance)
        if (row.unused === false) {
          isUnused = false
        }
      })
      if (isUnused) {
        unused += 1
      }
      if (unused > gapLimit) {
        return Object.keys(newTotals).map(sym => ({
          symbol: sym,
          balance: totals[sym].toString()
        }))
      }
      return Promise.delay(100)
        .then(() => getChainBalances(symbol, xpub, change, index + 1, newTotals, unused))
    })
}

const getHDBalances = (symbol, xpub) => {
  return Promise.props({
    receive: getChainBalances(symbol, xpub, 0),
    change: getChainBalances(symbol, xpub, 1)
  })
    .then(results => {
      const totals = results.receive.map(r => {
        const change = results.change.find(c => c.symbol === r.symbol)
        return {
          symbol: r.symbol,
          balance: Big(r.balance).add(change.balance).toString()
        }
      })
      return totals
    })
    .catch(() => {
      console.log('There was a problem getting wallet balance, try again later.')
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
    return Promise.resolve()
      .then(() => {
        if (xpub) return getHDBalances(symbol, xpub)
        return getBalances(symbol, address)
      })
      .then(totals => {
        dispatch({
          type: SET_WALLET_SYNC_TIME,
          wallet
        })
        // save balances
        totals.forEach(row => {
          // don't add a new transaction if the balance hasn't changed
          const balances = getBalancesByWalletIdForSymbol(state, row.symbol) || {}
          if (balances[walletId] === Number(row.balance)) return
          addImportedTransaction({
            symbol: row.symbol,
            balance: row.balance,
            walletId
          })(dispatch, getState)
        })
      })
  })
}
