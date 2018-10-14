var HotWallet = {}

window.HotWallet = HotWallet

HotWallet.appId = window.location.search.substr(1)

HotWallet.appScript = document.createElement('script')
HotWallet.appScript.onerror = function (err) {
  console.log('script err:', err)
  document.getElementsByTagName('main')[0].innerHTML = [
    '<div style="padding: 25px;">',
    '  <h1>Page Not Found</h1>',
    '</div>'
  ].join('\n')
}
// HotWallet.appScriptElement.src = `https://api.hotwallet.com/apps/${HotWalletAppId}.js`
HotWallet.appScript.src = `http://localhost:3001/apps/${HotWallet.appId}.js`
document.head.appendChild(HotWallet.appScript)

HotWallet.resizeIframe = function () {
  if (document.body.scrollHeight === HotWallet.iframeHeight) return
  HotWallet.iframeHeight = document.body.scrollHeight
  window.parent.postMessage({
    height: document.body.scrollHeight
  }, '*')
}

window.addEventListener('load', HotWallet.resizeIframe)

setInterval(HotWallet.resizeIframe, 250)

HotWallet.getTransactions = function () { return [] }
HotWallet.getWallets = function () {}
HotWallet.encrypt = function () {}
HotWallet.decrypt = function () {}
HotWallet.sign = function () {}
HotWallet.verify = function () {}
HotWallet.getPublicKey = function () {}
