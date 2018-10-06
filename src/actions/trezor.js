import TrezorConnect, { DEVICE_EVENT, DEVICE } from 'trezor-connect'
import { addWallet, fetchWalletBalances } from './wallets'
import b58 from 'bs58check'

function ypubToXpub(ypub) {
  var data = b58.decode(ypub)
  data = data.slice(4)
  data = Buffer.concat([Buffer.from('0488b21e','hex'), data])
  return b58.encode(data)
}

export const getTrezorAccountInfo = () => (dispatch, getState) => {
  const symbol = 'BTC'
  TrezorConnect.getAccountInfo({
    coin: symbol.toLowerCase()
  })
    .then(({ payload }) => {
      const isSegwit = payload.address[0] === '3'
      const isYpub = payload.xpub[0] === 'y'
      const xpub = isYpub ? ypubToXpub(payload.xpub) : payload.xpub
      const wallet = {
        name: `Bitcoin Trezor Wallet`,
        isTrezorWallet: true,
        symbol,
        xpub,
        isSegwit
      }
      dispatch(addWallet(wallet))
      fetchWalletBalances()(dispatch, getState)
    })

}

TrezorConnect.on(DEVICE_EVENT, event => {
  if (event.type === DEVICE.CONNECT) {

  } else if (DEVICE.DISCONNECT) {

  }
})
