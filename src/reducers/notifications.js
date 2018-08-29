import * as helpers from './helpers'

import {
  ADD_OR_UPDATE_NOTIFICATION,
  REMOVE_NOTIFICATION
} from '../actions/notifications'

import {combineReducers} from 'redux'

export const byId = (state = {}, action) => {
  switch (action.type) {
    case ADD_OR_UPDATE_NOTIFICATION:
      return helpers.addToOneToOneMapping(state, [action.notification], 'id')
    case REMOVE_NOTIFICATION:
      return helpers.removeFromOneToOneMapping(state, [action.id], 'id')
    default:
      return state
  }
}

export const list = (state = [], action) => {
  switch (action.type) {
    case ADD_OR_UPDATE_NOTIFICATION:
      return helpers.addToIdList(state, [action.notification], 'id')
    case REMOVE_NOTIFICATION:
      return helpers.removeFromIdList(state, [action.id])
    default:
      return state
  }
}

export default combineReducers({byId, list})
