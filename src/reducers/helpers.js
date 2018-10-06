import union from 'lodash/union'
import pickBy from 'lodash/pickBy'

/**
 * Adds entities to a list of ids, using their idProp as an
 * identifier.  If all ids are already in the list, the original
 * list will be returned.  Otherwise a new list will be returned.
 */
export const addToIdList = (list, entities, idProp) => {
  if (entities.every(entity => list.includes(entity[idProp]))) {
    return list
  }
  return union(list, entities.map(entity => entity[idProp]))
}

/**
 * Removes entities from a list of ids.  If there is no change
 * to the original list then the original object will be returned,
 * otherwise a new list will be returned
 */
export const removeFromIdList = (list, entityIds) => {
  const newList = list.filter(id => !entityIds.includes(id))
  if (newList.length === list.length) return list
  return newList
}

/**
 * Adds a list of new entites to the given mapping object
 * If the entities all exist in the map object then the original
 * object will be returned.
 * In other cases a new mapping object will be returned
 * Objects will be mapped by the entities' byProp property
 **/
export const addToOneToOneMapping = (map, entities, byProp) => {
  let existingEntities = Object.values(map)
  if (entities.every(newEntity => existingEntities.some(entity => entity === newEntity))) {
    return map
  }
  const newMap = entities.reduce((newMap, entity) => {
    newMap[entity[byProp]] = entity
    return newMap
  }, {})
  return { ...map, ...newMap }
}

/**
 * Removes from a one to one mapping object.
 * Existing entities will be tested by strict equality on their idProp against
 * the elements of the list.  If any are to be removed, a new map
 * will be returned without them.  Otherwise the existing map
 * will be returned
 **/
export const removeFromOneToOneMapping = (map, entityIds, idProp) => {
  let existingEntityIds = Object.values(map).map(entity => entity[idProp])
  if (entityIds.every(entityId => !existingEntityIds.includes(entityId))) {
    return map
  }
  return pickBy(map, (entity) => !entityIds.includes(entity[idProp]))
}

/**
 * Adds a list of entities to a one to many map object.  If all
 * entities are already in the mapping object, then the original
 * mapping object will be returned.  Otherwise a new mapping object
 * will be returned
 **/
export const addToOneToManyMapping = (map, entities, byProp) => {
  let changed = false
  const newMap = { ...map }
  for (let entity of entities) {
    if (newMap[entity[byProp]] !== undefined) {
      if (!newMap[entity[byProp]].includes(entity)) {
        newMap[entity[byProp]] = [ ...newMap[entity[byProp]], entity ]
        changed = true
      }
    } else {
      newMap[entity[byProp]] = [ entity ]
      changed = true
    }
  }
  return changed ? newMap : map
}

/**
 * Removes from a one to many mapping object.
 * Existing entities will be tested by strict equality on their idProp against
 * the elements of the list.  If any are to be removed, a new map
 * will be returned without them.  Otherwise the existing map
 * will be returned.
 **/
export const removeFromOneToManyMapping = (map, entityIds, idProp) => {
  let changed = false
  const newMap = { ...map }
  const existingKeys = Object.keys(newMap)

  for (let k of existingKeys) {
    const newList = newMap[k].filter(entity => !entityIds.includes(entity[idProp]))
    if (newList.length !== newMap[k].length) {
      newMap[k] = newList
      changed = true
    }

    if (newMap[k].length === 0) {
      delete newMap[k]
      changed = true
    }
  }

  return changed ? newMap : map
}
