import {
  ADD_WALLET,
  SET_WALLET_SYNC_TIME
} from '../actions/wallets'

const initialState = {}

export default (state = initialState, action) => {
  const wallet = (action && action.wallet) || {}
  if (!wallet.address) return state
  const walletId = `${wallet.symbol}:${wallet.address}`
  switch (action.type) {
    case ADD_WALLET:
      return { ...state, [walletId]: wallet }
    case SET_WALLET_SYNC_TIME:
      return { ...state, [walletId]: { ...wallet, lastSync: Date.now() } }
    default:
      return state
  }
}
