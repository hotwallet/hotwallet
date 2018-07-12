import {
  list,
  byId
} from './notifications'

import {
  ADD_OR_UPDATE_NOTIFICATION,
  REMOVE_NOTIFICATION
} from '../actions/notifications'

const notificationA = {id: 'aaaaaaaa-8002-40bf-a356-d739c630e2d4', state: 'STATE_A'}
const notificationA2 = {id: 'aaaaaaaa-8002-40bf-a356-d739c630e2d4', state: 'STATE_B'}
const notificationB = {id: 'bbbbbbbb-8002-40bf-a356-d739c630e2d4', state: 'STATE_A'}

describe('notifications list reducer', () => {
  it('should handle ADD_OR_UPDATE_NOTIFICATION', () => {
    expect(
      list([], {
        type: ADD_OR_UPDATE_NOTIFICATION,
        notification: notificationA
      })
    ).toEqual([notificationA.id])

    expect(
      list([notificationA.id], {
        type: ADD_OR_UPDATE_NOTIFICATION,
        notification: notificationB
      })
    ).toEqual([notificationA.id, notificationB.id])

    // don't reinsert same id
    expect(
      list([notificationA.id, notificationB.id], {
        type: ADD_OR_UPDATE_NOTIFICATION,
        notification: notificationA2
      })
    ).toEqual([notificationA.id, notificationB.id])
  })

  it('should handle REMOVE_NOTIFICATION', () => {
    expect(
      list([], {
        type: REMOVE_NOTIFICATION,
        id: notificationA.id
      })
    ).toEqual([])

    expect(
      list([notificationA.id, notificationB.id], {
        type: REMOVE_NOTIFICATION,
        id: notificationB.id
      })
    ).toEqual([notificationA.id])
  })
})

describe('notifications byId reducer', () => {
  it('should handle ADD_OR_UPDATE_NOTIFICATION', () => {
    expect(
      byId({}, {
        type: ADD_OR_UPDATE_NOTIFICATION,
        notification: notificationA
      })
    ).toEqual({[notificationA.id]: notificationA})

    expect(
      byId({[notificationA.id]: notificationA}, {
        type: ADD_OR_UPDATE_NOTIFICATION,
        notification: notificationB
      })
    ).toEqual({[notificationA.id]: notificationA, [notificationB.id]: notificationB})

    // overwrite object with same id
    expect(
      byId({[notificationA.id]: notificationA, [notificationB.id]: notificationB}, {
        type: ADD_OR_UPDATE_NOTIFICATION,
        notification: notificationA2
      })
    ).toEqual({[notificationA2.id]: notificationA2, [notificationB.id]: notificationB})
  })

  it('should handle REMOVE_NOTIFICATION', () => {
    expect(
      byId({}, {
        type: REMOVE_NOTIFICATION,
        id: notificationA.id
      })
    ).toEqual({})

    expect(
      byId({[notificationA.id]: notificationA, [notificationB.id]: notificationB}, {
        type: REMOVE_NOTIFICATION,
        id: notificationB.id
      })
    ).toEqual({[notificationA.id]: notificationA})
  })
})
