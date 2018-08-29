if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => {
      console.log('service-worker.js registered:', reg)
    })
    .catch(err => {
      console.log(err)
    })
}

window.addEventListener('beforeinstallprompt', e => {
  console.log('beforeinstallprompt', e)
  e.preventDefault()
  e.prompt()
  e.userChoice.then(result => {
    if (result.outcome === 'dismissed') {
      console.log('install prompt dismissed')
      return
    }
    console.log('install prompt accepted')
  })
})
