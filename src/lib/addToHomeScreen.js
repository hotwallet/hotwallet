if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
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
