if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
}

window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  e.prompt()
})
