if ('serviceWorker' in navigator) {
  // disabling for now because create-react-app 2.0 injects a broken service worker
  // navigator.serviceWorker.register('service-worker.js')
}

window.addEventListener('beforeinstallprompt', e => {
  window.temp = e
  // console.log('beforeinstallprompt', e)
  // e.preventDefault()
  // e.prompt()
  e.userChoice.then(result => {
    if (result.outcome === 'dismissed') {
      console.log('dismissed', result)
      return
    }
    console.log('installed', result)
  })
})
