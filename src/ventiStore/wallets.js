import Promise from 'bluebird'
import Big from 'big.js'
import client from '../lib/hotwalletClient'
import { addImportedTransaction, removeTransactions } from './transactions'
import { getBalancesByWalletIdForSymbol, getTransactionsForWallet, getWallets as getWalletsSelector } from '../ventiSelectors/transactions'
import { deriveAddress } from 'xpubjs'
import { state } from 'venti'

const fifteenMinutes = 1000 * 60 * 15
const gapLimit = 10

export const getWallets = () => getWalletsSelector()

export const addWallet = (wallet = {}) => {
  const id = getWalletId(wallet)
  state.set(`wallets.${id}`, wallet)
}

const getWalletId = (wallet = {}) => {
  if (wallet.address || wallet.xpub) {
    return wallet.address
      ? `${wallet.symbol}:${wallet.address}`
      : `${wallet.symbol}:${wallet.xpub}`
  }
}

export const deleteWallet = id => {
  const { [id]: value, ...remainingWallets } = state.get('wallets', {})
  state.set('wallets', remainingWallets)
  const txs = getTransactionsForWallet(id) || []
  const txIds = txs.map(tx => tx.id)
  removeTransactions(txIds)
}

export const setWalletName = (id, name) => {
  state.set(`wallets.${id}`, name)
}

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
  return Promise.resolve()
    .then(() => deriveAddress({ symbol, xpub, path }))
    .catch(err => {
      err.details = { symbol, xpub }
      throw err
    })
    .then(address => getBalances(symbol, address))
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
    .catch(err => {
      console.log('Could not get wallet balance, try again later.', err.details)
      return []
    })
}

export const fetchWalletBalances = () => {
  state.set('wallets', {})
  const wallets = state.get('wallets')
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
        const id = getWalletId(wallet)
        state.set(`wallets.${id}.lastSync`, Date.now())
        // save balances
        totals.forEach(row => {
          // don't add a new transaction if the balance hasn't changed
          const balances = getBalancesByWalletIdForSymbol(row.symbol) || {}
          if (balances[walletId] === Number(row.balance)) return
          addImportedTransaction({
            symbol: row.symbol,
            balance: row.balance,
            walletId
          })
        })
      })
  })
}
