import React from 'react'
import { render } from 'react-dom'
import App from './components/App'
import 'sanitize.css/sanitize.css'
import './index.css'
import './ventiStore/index'
import { ThemeProvider } from './contexts/theme'

const startApp = () =>
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
    document.querySelector('#root')
  )

if (!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}
