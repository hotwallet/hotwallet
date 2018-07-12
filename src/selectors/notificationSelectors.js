import { createSelector } from 'reselect'

const getList = (state) => state.notifications.list
const getById = (state) => state.notifications.byId

export const getNotificationList = createSelector(
  [getList, getById],
  (list, byId) => list.map(id => byId[id])
)
