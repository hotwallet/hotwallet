import { addWallet, fetchWalletBalances } from './wallets'
import b58 from 'bs58check'

// import TrezorConnect, { DEVICE_EVENT, DEVICE } from 'trezor-connect'
const TrezorConnect = window.TrezorConnect

export const supportedSymbols = ['BTC', 'ETH', 'LTC', 'DASH', 'ZEC', 'BCH', 'BTG', 'XRP', 'ADA', 'XLM']

function ypubToXpub(ypub) {
  var data = b58.decode(ypub)
  data = data.slice(4)
  data = Buffer.concat([Buffer.from('0488b21e', 'hex'), data])
  return b58.encode(data)
}

export const getTrezorAccountInfo = security => (dispatch, getState) => {
  const { symbol } = security
  Promise.resolve()
    .then(() => {
      switch (symbol) {
        case 'BTC':
        case 'LTC':
        case 'DASH':
        case 'BCH':
        case 'BTG':
        case 'ZEC':
          return TrezorConnect.getAccountInfo({
            coin: symbol.toLowerCase()
          })
        case 'ETH':
          return TrezorConnect.ethereumGetAddress({
            path: "m/44'/60'/0'"
          })
        case 'XRP':
          return TrezorConnect.rippleGetAddress({
            path: "m/44'/144'/1'/0/0"
          })
        case 'XLM':
          return TrezorConnect.stellarGetAddress({
            path: "m/44'/148'/0'"
          })
        case 'ADA':
          return TrezorConnect.cardanoGetAddress({
            path: "m/44'/1815'/0'/0/0"
          })
        default:
      }
    })
    .then(({ payload }) => {
      if (!payload) return
      if (!payload.address) return
      const wallet = {
        name: `${security.name} Trezor Wallet`,
        isTrezorWallet: true,
        symbol: security.symbol,
        xpub: payload.xpub
      }
      if (symbol === 'BTC') {
        wallet.isSegwit = payload.address[0] === '3'
        const isYpub = payload.xpub[0] === 'y'
        wallet.xpub = isYpub ? ypubToXpub(payload.xpub) : payload.xpub
      }
      dispatch(addWallet(wallet))
      fetchWalletBalances()(dispatch, getState)
    })
}

TrezorConnect.on('DEVICE_EVENT', event => {
  if (event.type === 'device-connect') {

  } else if (event.type === 'device-disconnect') {

  }
})
