import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'
import { generatePassphrase } from '../lib/useapassphrase'
import PassphraseModal from './PassphraseModal'

import H1 from './H1'

class Settings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {isModalOpen: false}
  }

  acceptPassphrase = () => {
    window.alert('passphrase accepted')
  }

  createAccount = () => {
    this.setState({isModalOpen: true, passphrase: generatePassphrase(10)})
  }

  generatePassphraseClose = () => {
    this.setState({isModalOpen: false})
  }

  render() {
    return (
      <div>
        <H1 text="Settings" />
        <PassphraseModal isModalOpen={this.state.isModalOpen} passphrase={this.state.passphrase} onClose={this.generatePassphraseClose} onNext={this.acceptPassphrase} />
        <Button onClick={this.createAccount}> Create New Account </Button>
        <Button onClick={() => window.alert('unimplemented')}> Link to existing account </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
