import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './store'
import App from './components/App'
import SocketClient from './lib/SocketClient'
import 'sanitize.css/sanitize.css'
import './index.css'

const target = document.querySelector('#root')
const socketClient = new SocketClient()

socketClient.start()

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
)
