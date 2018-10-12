const HotWallet_appId = window.location.search.substr(1)

window.HotWallet = {}

window.HotWallet.getTransactions = () => {
  return []
}

window.HotWallet.getWallets = () => {
  return []
}

const script = document.createElement('script')
script.onload = function () {
  //do stuff with the script
}
script.onerror = function () {
  const notFoundHTML = `
   <div style="padding: 25px;">
     <h1>Page Not Found</h1>
   </div>
  `
  document.getElementsByTagName('main')[0].innerHTML = notFoundHTML
}
script.src = `https://api.hotwallet.com/apps/${HotWallet_appId}.js`


document.head.appendChild(script)
