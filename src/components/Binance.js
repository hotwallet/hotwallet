import React from 'react'
import { connect } from 'react-redux'
import H1 from './H1'
import { mapDispatchToProps } from '../actions'
import { Button, Message, Input, Icon } from 'semantic-ui-react'
import { borderColor, mobilePadding, desktopPadding } from '../lib/styles'
import { appName } from '../config'
import { createApiKeyUrl } from '../actions/binance'
import moment from 'moment'

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

class Binance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiKey: '',
      secretKey: ''
    }
  }

  connectBinance = () => {
    this.props.setBinanceApiKeys({
      apiKey: this.state.apiKey,
      secretKey: this.state.secretKey
    })
    this.props.fetchBinanceBalances()
  }

  disconnectBinance = () => {
    const confirmed = window.confirm('Disconnect and set Binance balances to zero?')
    if (confirmed) {
      this.props.setBinanceApiKeys({
        apiKey: '',
        secretKey: ''
      })
      this.props.zeroBinanceBalances()
    }
  }

  render() {
    const isMobile = this.props.isMobile
    const content = this.props.apiKey ? this.renderConnected() : this.renderNotConnected()
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

  renderErrorMessage() {
    if (!this.props.errorMessage) return
    return (
      <div class="ui inverted icon message">
        <Icon name="warning circle" />
        <div class="content">
          <div class="header">Error connecting to Binance</div>
          <p>{this.props.errorMessage}</p>
        </div>
      </div>
    )
  }

  renderLastUpdated() {
    return (
      <div class="ui inverted icon message">
        <i aria-hidden="true" class="check circle icon" />
        <div class="content">
          <div class="header">Connected</div>
            Updated balances {moment(this.props.lastUpdated).fromNow()}
        </div>
      </div>
    )
  }

  renderConnected() {
    return (
      <div>
        {this.renderErrorMessage()}
        {this.renderLastUpdated()}
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
            value={this.props.apiKey}
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
            onClick={this.disconnectBinance}
          >Disconnect</Button>
        </div>
      </div>
    )
  }

  renderNotConnected() {
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
              onChange={e => this.setState({ apiKey: e.target.value })}
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
              onChange={e => this.setState({ secretKey: e.target.value })}
            />
          </fieldset>
          <Button
            color="blue"
            fluid
            style={buttonStyle}
            onClick={this.connectBinance}
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
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  apiKey: state.binance.apiKey,
  errorMessage: state.binance.errorMessage,
  lastUpdated: state.binance.lastSync
})

export default connect(mapStateToProps, mapDispatchToProps)(Binance)
