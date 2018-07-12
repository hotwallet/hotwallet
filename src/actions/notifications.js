import { v4 } from 'uuid'

export const ADD_OR_UPDATE_NOTIFICATION = 'ADD_OR_UPDATE_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

export const addNotification = (notification) => ({type: ADD_OR_UPDATE_NOTIFICATION, notification: {id: v4(), ...notification}})

export const removeNotification = (id) => ({type: REMOVE_NOTIFICATION, id})

export const updateNotificationState = (id, state) => (dispatch, getState) => {
  const original = getState().notifications.byId[id]
  const copy = { ...original, state }
  dispatch({type: ADD_OR_UPDATE_NOTIFICATION, notification: copy})
}

export const updateNotification = (notification) => ({type: ADD_OR_UPDATE_NOTIFICATION, notification})
