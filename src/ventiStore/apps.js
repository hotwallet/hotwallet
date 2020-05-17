import { state } from 'venti'

export default state.set('apps', {
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
})

export const addApp = (appId) => {
  const enabled = state.get(`apps.enabled`, [])
  console.log('addApp, enabled apps --->>>', enabled)
  console.log('addApp, app to add --->>>', appId)
  state.set('apps.enabled', [...enabled, appId])
}

export const removeApp = (appId) => {
  const enabled = state.get(`apps.enabled`, [])
  console.log('removeApp, enabled apps --->>>', enabled)
  console.log('removeApp, app to remove --->>>', appId)
  const removedItems = enabled.filter(item => item !== appId)
  state.set('apps.enabled', [...removedItems])
}

// TODO: fetch apps instead of hardcoding them in the apps reducer
// export const fetchAllApps = () => (dispatch, getState) => {}
