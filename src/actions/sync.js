import * as sync from '../lib/sync.js'

export const SET_SYMMETRIC_KEY = 'SET_SYMMETRIC_KEY'
export const SET_ASYMMETRIC_KEY = 'SET_ASYMMETRIC_KEY'

export const generateKeys = (password) => async (dispatch, getState) => {
  let keys = await sync.generateKeys(password)

  dispatch({
    type: SET_SYMMETRIC_KEY,
    key: sync.arrayBufferToHexString(keys.rawSymmetricKey)
  })

  dispatch({
    type: SET_ASYMMETRIC_KEY,
    key: keys.rawAsymmetricKey
  })
}
