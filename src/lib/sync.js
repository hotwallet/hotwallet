import { ec as EC } from 'elliptic'
import { sync as syncSettings } from '../config'

export function stringToArrayBuffer(string) {
  var encoder = new window.TextEncoder('utf-8')
  return encoder.encode(string)
}

export function arrayBufferToHexString(arrayBuffer) {
  var byteArray = new Uint8Array(arrayBuffer)
  var hexString = ''
  var nextHexByte

  for (var i = 0; i < byteArray.byteLength; i++) {
    nextHexByte = byteArray[i].toString(16)
    if (nextHexByte.length < 2) {
      nextHexByte = '0' + nextHexByte
    }
    hexString += nextHexByte
  }
  return hexString
}

export const passwordToKey = async (password) => {
  return window.crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    {'name': 'PBKDF2'},
    false,
    ['deriveKey', 'deriveBits']
  )
}

export const generateSymmetric = async (passwordKey) => {
  let symmetricKey = await window.crypto.subtle.deriveKey(
    {
      'name': 'PBKDF2',
      'salt': stringToArrayBuffer(syncSettings.symmetricSalt),
      'iterations': syncSettings.iterations,
      'hash': syncSettings.hash
    },
    passwordKey,
    {'name': 'AES-GCM', 'length': 128},
    true,
    ['encrypt', 'decrypt']
  )

  return window.crypto.subtle.exportKey('raw', symmetricKey)
}

export const generateAsymmetric = async (passwordKey) => {
  let entropy = await window.crypto.subtle.deriveBits(
    {
      'name': 'PBKDF2',
      'salt': stringToArrayBuffer(syncSettings.asymmetricSalt),
      'iterations': syncSettings.iterations,
      'hash': syncSettings.hash
    },
    passwordKey,
    256
  )

  entropy = new Uint8Array(entropy)

  let ec = new EC('secp256k1')

  return ec.genKeyPair({entropy})
}

export const generateKeys = async (password) => {
  const passwordKey = await passwordToKey(password)
  const rawSymmetricKey = await generateSymmetric(passwordKey)
  const asymmetricKey = await generateAsymmetric(passwordKey)

  return {
    rawSymmetricKey: rawSymmetricKey,
    rawAsymmetricKey: asymmetricKey.getPrivate('hex')
  }
}
