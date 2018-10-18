var HotWallet = {}

window.HotWallet = HotWallet

// HotWallet.appId = window.location.search.substr(1)
//
// HotWallet.appScript = document.createElement('script')
// HotWallet.appScript.onerror = function (err) {
//   console.log('script err:', err)
//   document.getElementsByTagName('main')[0].innerHTML = [
//     '<div style="padding: 25px;">',
//     '  <h1>Page Not Found</h1>',
//     '</div>'
//   ].join('\n')
// }
// HotWallet.appScript.src = `https://api.hotwallet.com/apps/${HotWallet.appId}.js`
// // HotWallet.appScript.src = `http://localhost:3001/apps/${HotWallet.appId}.js`
// document.head.appendChild(HotWallet.appScript)

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
