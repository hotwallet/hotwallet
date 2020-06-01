import { state } from 'venti'

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
