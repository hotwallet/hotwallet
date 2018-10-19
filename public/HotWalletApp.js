var HotWallet = {}

window.HotWallet = HotWallet

HotWallet.stylesheet = document.createElement('link')
HotWallet.stylesheet.rel = 'stylesheet'
HotWallet.stylesheet.type = 'text/css'
HotWallet.stylesheet.href = 'https://hotwallet.com/HotWalletApp.css'
document.head.appendChild(HotWallet.stylesheet)

HotWallet.resizeIframe = function () {
  if (document.body.scrollHeight === HotWallet.iframeHeight) return
  HotWallet.iframeHeight = document.body.scrollHeight
  window.parent.postMessage({
    height: document.body.scrollHeight
  }, '*')
}

window.addEventListener('load', HotWallet.resizeIframe)

window.addEventListener('message', function (message) {
  if (!message.data.rpcId) return
  var event = new window.CustomEvent(message.data.rpcId, {
    detail: message.data.response
  })
  window.dispatchEvent(event)
})

setInterval(HotWallet.resizeIframe, 250)

HotWallet.rpc = function (action, payload) {
  var rpcId = Math.random().toString()
  window.parent.postMessage({
    rpcId: rpcId,
    action: action,
    payload: payload
  }, '*')
  return new Promise(function (resolve) {
    var handler = function (event) {
      resolve(event.detail)
      window.removeEventListener(rpcId, handler)
    }
    window.addEventListener(rpcId, handler)
  })
}

HotWallet.getTransactions = function () {
  return HotWallet.rpc('getTransactions')
}
HotWallet.getWallets = function () {}
HotWallet.encrypt = function () {}
HotWallet.decrypt = function () {}
HotWallet.sign = function () {}
HotWallet.verify = function () {}
HotWallet.getPublicKey = function () {}
