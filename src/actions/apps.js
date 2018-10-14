export const ADD_APP = 'ADD_APP'
export const REMOVE_APP = 'REMOVE_APP'

export const addApp = appId => ({ type: ADD_APP, appId })
export const removeApp = appId => ({ type: REMOVE_APP, appId })

// TODO: fetch apps instead of hardcoding them in the apps reducer
export const fetchAllApps = () => (dispatch, getState) => {}
