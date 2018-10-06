import { addWallet, fetchWalletBalances } from './wallets'
import b58 from 'bs58check'

// import TrezorConnect, { DEVICE_EVENT, DEVICE } from 'trezor-connect'
const TrezorConnect = window.TrezorConnect

function ypubToXpub(ypub) {
  var data = b58.decode(ypub)
  data = data.slice(4)
  data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data])
  return b58.encode(data)
}

export const getTrezorAccountInfo = (symbol) => (dispatch, getState) => {
  TrezorConnect.getAccountInfo({
    coin: symbol.toLowerCase()
  })
    .then(({ payload }) => {
      const wallets = []
      if (symbol === 'BTC') {
        const isSegwit = payload.address[0] === '3'
        const isYpub = payload.xpub[0] === 'y'
        const xpub = isYpub ? ypubToXpub(payload.xpub) : payload.xpub
        wallets.push({
          name: `Bitcoin Trezor Wallet`,
          isTrezorWallet: true,
          symbol,
          xpub,
          isSegwit
        })
      }
      const wallet = wallets[0]
      if (wallet) {
        dispatch(addWallet(wallet))
        fetchWalletBalances()(dispatch, getState)
      }
    })
}

TrezorConnect.on('DEVICE_EVENT', event => {
  if (event.type === 'device-connect') {

  } else if (event.type === 'device-disconnect') {

  }
})
