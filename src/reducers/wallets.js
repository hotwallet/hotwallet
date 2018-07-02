import {
  ADD_WALLET,
  SET_WALLET_SYNC_TIME
} from '../actions/wallets'

const initialState = {}

export default (state = initialState, action) => {
  const wallet = (action && action.wallet) || {}
  const walletId = `${wallet.symbol}:${wallet.address}`
  switch (action.type) {
    case ADD_WALLET:
      return { ...state, [walletId]: action.wallet }
    case SET_WALLET_SYNC_TIME:
      const wallet = state[action.walletId]
      return { ...state, [action.walletId]: { ...wallet, lastSync: Date.now() } }
    default:
      return state
  }
}
