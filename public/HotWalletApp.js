const HotWalletAppId = window.location.search.substr(1)

window.HotWallet = {}

window.HotWallet.getTransactions = () => {
  return []
}

window.HotWallet.getWallets = () => {
  return []
}

const HotWalletScript = document.createElement('script')
HotWalletScript.onerror = function () {
  const notFoundHTML = `
   <div style="padding: 25px;">
     <h1>Page Not Found</h1>
   </div>
  `
  document.getElementsByTagName('main')[0].innerHTML = notFoundHTML
}
HotWalletScript.src = `https://api.hotwallet.com/apps/${HotWalletAppId}.js`
document.head.appendChild(HotWalletScript)

const HotWalletStyle = document.createElement('link')
HotWalletStyle.rel = 'stylesheet'
HotWalletStyle.type = 'text/css'
HotWalletStyle.href = '/HotWalletApp.css'
document.head.prepend(HotWalletStyle)

const HotWalletSendHeight = function () {
  window.parent.postMessage({
    height: document.body.scrollHeight
  }, '*')
}

window.addEventListener('load', HotWalletSendHeight)
window.addEventListener('resize', HotWalletSendHeight)
