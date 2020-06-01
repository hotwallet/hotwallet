import reactStateEventer from 'react-state-eventer'
import { state } from 'venti'
import { v4 } from 'uuid'

import { dateRanges } from './components/DateRangeSelector'

const id = v4()

// always become primary on load
window.localStorage.setItem('primary', id)

window.onfocus = () => {
  if (window.localStorage.getItem('primary') !== id) {
    window.location.reload()
  }
}

const initialState = {
  'accounts': {},
  'apps': {
    sideBarApps: [
      {
        id: 'hotwallet-app-news',
        icon: 'world',
        uri: '/apps/news',
        name: 'Crypto News'
      },
      {
        id: 'ledger',
        image: 'https://chnnl.s3.amazonaws.com/tarragon/hardware/128x128/ledger.png',
        uri: '/ledger',
        name: 'Ledger Connect'
      },
      {
        id: 'trezor',
        image: 'https://chnnl.s3.amazonaws.com/tarragon/hardware/64x64/trezor.png',
        uri: '/trezor',
        name: 'Trezor Connect'
      },
      {
        id: 'binance',
        image: 'https://chnnl.s3.amazonaws.com/tarragon/exchanges/64x64/binance.png',
        uri: '/binance',
        name: 'Binance Connect'
      }
    ],
    enabled: ['ledger', 'trezor', 'binance', 'hotwallet-app-news']
  },
  'assets': {},
  'binance': {
    apiKey: '',
    secretKey: '',
    lastSync: null,
    binanceErrorMessage: ''
  },
  'ephemeral': {
    device: {},
    filterSymbolsQuery: '',
    rowSlice: [0, 1000]
  },
  'ledger': {
    data: null
  },
  'portfolio': {
    range: dateRanges.find((dateRange) => !!dateRange.isDefault),
    chartData: []
  },
  'prices': {},
  'securities': {
    allSymbols: [],
    bySymbol: {},
    metadata: { isFetching: false, failureMessage: undefined, updatedAt: new Date().toISOString(), balancesOnly: false }
  },
  'settings': {
    primaryAccountId: 'ad133e74-789d-44fd-be52-46150de04e68'
  },
  'transactions': {
    byId: {},
    bySymbol: {},
    byWalletId: {}
  },
  'wallets': {},
  'user': { baseCurrency: 'USD' }
}

const storage = JSON.parse(window.localStorage.getItem('storage')) || initialState

if (storage !== null) {
  state.set(storage)
} else {
  window.localStorage.setItem('storage', JSON.stringify(initialState))
}

function listenToChanges(params) {
  params.forEach(p => {
    state.on(p, newState => {
      const store = JSON.parse(window.localStorage.getItem('storage')) || initialState

      store[p] = { ...newState.value }
      window.localStorage.setItem('storage', JSON.stringify(store))
    })
  })
}

listenToChanges([
  'accounts',
  'apps',
  'assets',
  'binance',
  'ephemeral',
  'ledger',
  'portfolio',
  'prices',
  'securities',
  'settings',
  'transactions',
  'wallets',
  'user'
])

export const withState = reactStateEventer(state)
