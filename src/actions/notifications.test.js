import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as notifications from './notifications'

const mockStore = configureStore([thunk])

const notificationA = {id: 'aaaaaaaa-8002-40bf-a356-d739c630e2d4', state: 'STATE_A'}
const notificationB = {id: 'bbbbbbbb-8002-40bf-a356-d739c630e2d4', state: 'STATE_A'}
const withoutId = {state: 'STATE_B'}

const mockState = {
  notifications: {
    byId: {
      [notificationA.id]: notificationA,
      [notificationB.id]: notificationB
    },
    list: [notificationA.id, notificationB.id]
  }
}

it('should dispatch an action to add an notification', () => {
  const store = mockStore(mockState)
  const action = store.dispatch(notifications.addNotification(notificationA))
  expect(action.notification.id).toBe(notificationA.id)
  const actions = store.getActions()
  expect(actions).toEqual([{type: notifications.ADD_OR_UPDATE_NOTIFICATION, notification: notificationA}])
})

it('should assign a v4 uuid as an id if none is supplied', () => {
  const uuidV4Regex = /^[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}$/i
  const store = mockStore(mockState)
  const action = store.dispatch(notifications.addNotification(withoutId))
  expect(action.notification.id).toMatch(uuidV4Regex)
})

it('should dispatch an action to remove a notification', () => {
  const store = mockStore(mockState)
  store.dispatch(notifications.removeNotification(notificationA.id))
  const actions = store.getActions()
  expect(actions).toEqual([{type: notifications.REMOVE_NOTIFICATION, id: notificationA.id}])
})

it('should dispatch an action to update a notification state', () => {
  const store = mockStore(mockState)
  store.dispatch(notifications.updateNotificationState(notificationA.id, 'STATE_B'))
  const actions = store.getActions()
  expect(actions).toEqual([{
    type: notifications.ADD_OR_UPDATE_NOTIFICATION,
    notification: {id: 'aaaaaaaa-8002-40bf-a356-d739c630e2d4', state: 'STATE_B'}}
  ])
})

it('should dispatch an action to update the notification on update', () => {
  const store = mockStore(mockState)
  store.dispatch(notifications.addNotification(notificationA))
  const actions = store.getActions()
  expect(actions).toEqual([{type: notifications.ADD_OR_UPDATE_NOTIFICATION, notification: notificationA}])
})
