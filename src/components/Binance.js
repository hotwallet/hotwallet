import React, { useState } from 'react'
import { connect } from 'react-redux'
import H1 from './H1'
import { mapDispatchToProps } from '../actions'
import { Button, Message, Input } from 'semantic-ui-react'
import { borderColor, mobilePadding, desktopPadding } from '../lib/styles'
import { appName } from '../config'
import moment from 'moment'
import { withTheme, compose } from '../contexts'
import { useVenti } from 'venti'
import { setBinanceApiKeys, fetchBinanceBalances, createApiKeyUrl, zeroBinanceBalances } from '../ventiStore/binance'

const buttonStyle = {
  marginBottom: 20
}
const inputStyle = {
  backgroundColor: 'none',
  padding: '0.5em 0.5em 0.5em 1em',
  border: `2px solid ${borderColor}`,
  textAlign: 'center',
  outline: 'none'
}
const labelStyle = {
  marginBottom: 5,
  display: 'block'
}
const liStyle = {
  margin: '15px 0',
  padding: 0
}
const fieldsetStyle = {
  border: 'none',
  margin: 0,
  padding: 0,
  marginBottom: 20
}

function Binance({ isMobile }) {
  const state = useVenti()
  const apiKey = state.get(`binance.apiKey`, '')
  const binanceErrorMessage = state.get(`binance.binanceErrorMessage`, '')
  const lastSync = state.get(`binance.lastSync`, '')

  const [binanceApiKey, setBinanceApiKey] = useState('')
  const [secretKey, setSecretKey] = useState('')

  const connectBinance = () => {
    setBinanceApiKeys({
      apiKey: binanceApiKey,
      secretKey: secretKey
    })
    fetchBinanceBalances()
  }

  const disconnectBinance = () => {
    const confirmed = window.confirm('Disconnect and set Binance balances to zero?')
    if (confirmed) {
      setBinanceApiKeys({
        binanceApiKey: '',
        secretKey: ''
      })
      zeroBinanceBalances()
    }
  }

  const renderErrorMessage = () => {
    if (!binanceErrorMessage) return
    return (
      <Message
        color="black"
        icon="warning circle"
        header="Error connecting to Binance"
        content={binanceErrorMessage}
      />
    )
  }

  const renderLastUpdated = () => {
    return (
      <Message
        color="black"
        icon="check circle"
        header="Connected"
        content={`Updated balances ${moment(lastSync).fromNow()}`}
      />
    )
  }

  const renderConnected = () => {
    return (
      <div>
        {renderErrorMessage()}
        {renderLastUpdated()}
        <fieldset style={fieldsetStyle}>
          <label style={labelStyle}>
            API Key
          </label>
          <Input
            transparent
            focus
            fluid
            inverted
            color="#fff"
            style={inputStyle}
            disabled
            className="monospace"
            value={apiKey}
          />
        </fieldset>
        <fieldset style={fieldsetStyle}>
          <label style={labelStyle}>
            Secret Key
          </label>
          <Input
            transparent
            focus
            fluid
            inverted
            color="#fff"
            style={inputStyle}
            disabled
            className="monospace"
            value={'*'.repeat(64)}
          />
        </fieldset>
        <div>
          <Button
            color="red"
            style={buttonStyle}
            onClick={disconnectBinance}
          >Disconnect</Button>
        </div>
      </div>
    )
  }

  const renderNotConnected = () => {
    return (
      <div className="ui divided stackable two column grid">
        <div className="column">
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              API Key
            </label>
            <Input
              transparent
              focus
              fluid
              inverted
              color="#fff"
              style={inputStyle}
              className="monospace"
              onChange={e => setBinanceApiKey(e.target.value)}
            />
          </fieldset>
          <fieldset style={fieldsetStyle}>
            <label style={labelStyle}>
              Secret Key
            </label>
            <Input
              transparent
              fluid
              inverted
              color="#fff"
              style={inputStyle}
              className="monospace"
              onChange={e => setSecretKey(e.target.value)}
            />
          </fieldset>
          <Button
            color="blue"
            fluid
            style={buttonStyle}
            onClick={connectBinance}
          >Connect</Button>
        </div>
        <div className="column">
          <Message color="black">
            <Message.Header>
              Instructions
            </Message.Header>
            <ol style={{ margin: 15, padding: 0 }}>
              <li style={liStyle}>
                Go to your <a
                  href={createApiKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >Binance API Settings</a>.
              </li>
              <li style={liStyle}>
                Enter API key label '{appName}' then tap 'Create New Key'.
              </li>
              <li style={liStyle}>
                Check your email and tap the 'Confirm' button.
              </li>
              <li style={liStyle}>
                Tap 'Edit', uncheck 'Enable Trading', then tap 'Save'.
                Make sure only 'Read Info' is checked.
              </li>
              <li style={liStyle}>
                Paste your keys above, and click 'Connect'.
              </li>
            </ol>
          </Message>
        </div>
      </div>
    )
  }

  const content = apiKey ? renderConnected() : renderNotConnected()
  return (
    <div>
      <H1 text="Binance Connect" />
      <div
        style={{
          padding: isMobile ? mobilePadding : desktopPadding
        }}
      >
        {content}
      </div>
    </div>
  )
}

export default compose(
  connect(mapDispatchToProps),
  withTheme
)(Binance)
