import * as sync from '../lib/sync.js'

export const SET_SYMMETRIC_KEY = 'SET_SYMMETRIC_KEY'
export const SET_ASYMMETRIC_KEY = 'SET_ASYMMETRIC_KEY'
export const SET_PASSPHRASE = 'SET_PASSPHRASE'

export const generateKeys = (passphrase) => async (dispatch, getState) => {
  let keys = await sync.generateKeys(passphrase)

  dispatch({
    type: SET_PASSPHRASE,
    passphrase: passphrase
  })

  dispatch({
    type: SET_SYMMETRIC_KEY,
    key: keys.symmetricKeyString
  })

  dispatch({
    type: SET_ASYMMETRIC_KEY,
    key: keys.asymmetricKeyString
  })
}
