import React from 'react'
import { connect } from 'react-redux'
import { Modal, Button, Table, Segment } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'

const nextButtonStyle = {
  width: '70%',
  marginBottom: 5
}

const cancelButtonStyle = {
  width: '27%',
  marginBottom: 5
}

const rowStyle = {
  color: '#fff',
  textAlign: 'center'
}

class PassphraseModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputHasFocus: false
    }
  }

  onInputFocus = () => {
    this.setState({ inputHasFocus: true })
  }

  onInputBlur = () => {
    // this.setState({ inputHasFocus: false })
  }

  close = () => {
    this.props.onClose()
    this.setState({ inputHasFocus: false })
  }

  render() {
    const {
      isModalOpen
    } = this.props

    return (
      <Modal
        closeIcon
        size="mini"
        open={isModalOpen}
        onClose={this.close}
        onOpen={this.onOpen}
        style={{
          backgroundColor: lightBg
        }}
      >
        <Modal.Header style={{ color: '#fff' }}>
          <div>
            <span style={{
              fontSize: 18,
              verticalAlign: 'middle',
              display: 'inline'
            }}>Passphrase</span>
          </div>

        </Modal.Header>
        <Modal.Content style={{ paddingTop: 0 }}>
          <Table basic="very" celled compact="very">
            <Table.Body>
              <Table.Row style={rowStyle} key="passphrase">
                <Table.Cell width="ten">
                  <Segment vertical style={{color: 'green', backgroundColor: 'rgba(0,0,0,.15)'}}>{this.props.passphrase}</Segment>
                  <Segment vertical style={{backgroundColor: 'rgba(0,0,0,.15)'}}> Please write down your passphrase.  You will need it to link other devices to the account </Segment>
                </Table.Cell>
              </Table.Row>
              <Table.Row style={rowStyle} key="buttons">
                <Table.Cell width="ten">
                  <Button
                    color="red"
                    style={cancelButtonStyle}
                    onClick={this.close}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="black"
                    style={nextButtonStyle}
                    passphrase={this.props.passphrase}
                    onClick={this.props.onNext}
                  >
                    Next
                  </Button>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(PassphraseModal)
