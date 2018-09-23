import {
  ADD_WALLET,
  DELETE_WALLET,
  SET_WALLET_SYNC_TIME,
  SET_WALLET_NAME
} from '../actions/wallets'

const initialState = {}

export default (state = initialState, action) => {
  if (action.type === SET_WALLET_NAME) {
    const wallet = state[action.id]
    return { ...state, [action.id]: { ...wallet, name: action.name } }
  }
  if (action.type === DELETE_WALLET) {
    const walletId = action.id
    const { [walletId]: value, ...remainingWallets } = state
    return remainingWallets
  }
  const wallet = (action && action.wallet) || {}
  if (!wallet.address && !wallet.xpub) return state
  const walletId = wallet.address
    ? `${wallet.symbol}:${wallet.address}`
    : `${wallet.symbol}:${wallet.xpub}`
  switch (action.type) {
    case ADD_WALLET:
      return { ...state, [walletId]: wallet }
    case SET_WALLET_SYNC_TIME:
      return { ...state, [walletId]: { ...wallet, lastSync: Date.now() } }
    default:
      return state
  }
}
