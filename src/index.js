import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { history, getStoreAsync } from './store'
import App from './components/App'
import 'sanitize.css/sanitize.css'
import './index.css'

const target = document.querySelector('#root')

getStoreAsync().then((store) => {
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
})
