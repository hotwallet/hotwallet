import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './reduxStore'
import App from './components/App'
import 'sanitize.css/sanitize.css'
import './index.css'

const startApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.querySelector('#root')
  )

if (!window.cordova) {
  startApp()
} else {
  document.addEventListener('deviceready', startApp, false)
}
