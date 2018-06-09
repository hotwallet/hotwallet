import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { Modal, Button, Message, Input, Icon, Image } from 'semantic-ui-react'
import { lightBg, borderColor } from '../lib/styles'
import { appName } from '../config'
import { createApiKeyUrl } from '../actions/binance'

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

class BinanceSetupModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apiKey: '',
      secretKey: ''
    }
  }

  connectBinance() {
    this.props.setBinanceApiKeys({
      apiKey: this.state.apiKey,
      secretKey: this.state.secretKey
    })
    this.props.fetchBinanceBalances()
  }

  render() {
    const {
      isModalOpen,
      openBinanceSetupModal
    } = this.props

    return (
      <Modal
        closeIcon
        size="mini"
        open={isModalOpen}
        onClose={() => openBinanceSetupModal(false)}
        style={{
          backgroundColor: lightBg
        }}
      >
        <Modal.Header style={{ color: '#fff' }}>
          <Image
            src="https://chnnl.s3.amazonaws.com/tarragon/exchanges/32x32/binance.png"
            inline
            verticalAlign="middle"
            style={{marginRight: 12}}
          />
          <span style={{
            fontSize: 18,
            verticalAlign: 'middle'
          }}>Import from Binance</span>
        </Modal.Header>
        <Modal.Content>
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
              onChange={e => this.setState({ secretKey: e.target.value })}
            />
          </fieldset>
          <Button
            color="blue"
            fluid
            style={buttonStyle}
            onClick={() => this.connectBinance()}
          >Connect</Button>
          <Message color="black">
            <Message.Header>
              <Icon name="help circle" style={{ marginRight: 5 }} />
              Instructions
            </Message.Header>
            <ol style={{ margin: 15, padding: 0 }}>
              <li style={liStyle}>
                Go to your <a
                  href={createApiKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Binance API Settings
                </a>.
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
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(BinanceSetupModal)
