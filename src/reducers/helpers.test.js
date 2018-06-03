import * as helpers from './helpers'

const idList = ['1', '2']
const oneToOneMapping = {'1': {id: '1'}, '2': {id: '2'}}
const oneToManyMapping = {
  'a': [{id: '1', cat: 'a'}],
  'b': [{id: '2', cat: 'b'}, {id: '3', cat: 'b'}]
}

describe('addToIdList', () => {
  test('Doesn\'t add existing entities to list', () => {
    expect(helpers.addToIdList(idList, [{id: '1'}, {id: '3'}], 'id')).toEqual(['1', '2', '3'])
  })

  test('Returns same list if no changes required', () => {
    expect(helpers.addToIdList(idList, [{id: '1'}, {id: '2'}], 'id')).toBe(idList)
  })

  test('Adds non-existing entities to list', () => {
    expect(helpers.addToIdList(idList, [{id: '1'}, {id: '5'}], 'id')).toEqual(['1', '2', '5'])
  })
})

describe('removeFromIdList', () => {
  test('Doesn\'t do anything if ids not in list', () => {
    expect(helpers.removeFromIdList(idList, ['6', '7'])).toBe(idList)
  })

  test('Returns list without ids specified', () => {
    expect(helpers.removeFromIdList(idList, ['2', '4'])).toEqual(['1'])
  })
})

describe('addToOneToOneMapping', () => {
  test('Doesn\'t add existing entities to mapping', () => {
    expect(
      helpers.addToOneToOneMapping(oneToOneMapping, [{id: '1'}, {id: '3'}], 'id')
    ).toEqual({'1': {id: '1'}, '2': {id: '2'}, '3': {id: '3'}})
  })

  test('Returns same mapping if no changes required', () => {
    expect(
      helpers.addToOneToOneMapping(oneToOneMapping, [oneToOneMapping['1']], 'id')
    ).toBe(oneToOneMapping)
  })

  test('Adds non-existing entities to list', () => {
    expect(
      helpers.addToOneToOneMapping(oneToOneMapping, [{id: '5'}, {id: '6'}], 'id')
    ).toEqual({'1': {id: '1'}, '2': {id: '2'}, '5': {id: '5'}, '6': {id: '6'}})
  })
})

describe('removeFromOneToOneMapping', () => {
  test('Removes existing elements from mapping', () => {
    expect(
      helpers.removeFromOneToOneMapping(oneToOneMapping, ['1', '3'], 'id')
    ).toEqual({'2': {id: '2'}})
  })

  test('Returns same mapping if no changes required', () => {
    expect(
      helpers.removeFromOneToOneMapping(oneToOneMapping, ['7', '5'], 'id')
    ).toBe(oneToOneMapping)
  })
})

describe('addToOneToManyMapping', () => {
  test('Adds entries without adding existing entities mapping', () => {
    expect(
      helpers.addToOneToManyMapping(
        oneToManyMapping,
        [oneToManyMapping.a[0], {id: '7', cat: 'a'}, {id: '8', cat: 'c'}, oneToManyMapping.a[0]],
        'cat'
      )
    ).toEqual({
      'a': [{id: '1', cat: 'a'}, {id: '7', cat: 'a'}],
      'b': [{id: '2', cat: 'b'}, {id: '3', cat: 'b'}],
      'c': [{id: '8', cat: 'c'}]
    })
  })

  test('Returns same mapping if no changes required', () => {
    expect(
      helpers.addToOneToManyMapping(oneToManyMapping, [oneToManyMapping.a[0]], 'cat')
    ).toBe(oneToManyMapping)
  })
})

describe('removeFromOneToManyMapping', () => {
  test('Correctly removes entries that are in the mapping', () => {
    expect(
      helpers.removeFromOneToManyMapping(
        oneToManyMapping,
        ['1', 'nonexistant'],
        'id'
      )
    ).toEqual({
      'b': [{id: '2', cat: 'b'}, {id: '3', cat: 'b'}]
    })
  })

  test('Returns same mapping if no changes required', () => {
    expect(
      helpers.removeFromOneToManyMapping(oneToManyMapping, ['7'], 'id')
    ).toBe(oneToManyMapping)
  })
})
