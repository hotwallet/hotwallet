const __HotWalletAppId = window.location.search.substr(1)

window.HotWallet = {}

window.HotWallet.getTransactions = () => {
  return []
}

window.HotWallet.getWallets = () => {
  return []
}

const script = document.createElement('script')

script.onerror = function () {
  const notFoundHTML = `
   <div style="padding: 25px;">
     <h1>Page Not Found</h1>
   </div>
  `
  document.getElementsByTagName('main')[0].innerHTML = notFoundHTML
}

script.src = `https://api.hotwallet.com/apps/${__HotWalletAppId}.js`

document.head.appendChild(script)
