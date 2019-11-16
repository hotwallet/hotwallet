import StateEventer from 'state-eventer'
import reactStateEventer from 'react-state-eventer'

export const state = new StateEventer()

// initialize state
state.set({
  accounts: {},
  assets: {},
  prices: {},
  settings: {
    primaryAccountId: 'ad133e74-789d-44fd-be52-46150de04e68'
  },
  transactions: {},
  wallets: {}
})

export const withState = reactStateEventer(state)