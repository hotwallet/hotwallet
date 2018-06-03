import React from 'react'
import { connect } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { lightBg } from '../lib/styles'

class SecurityModal extends React.Component {
  render() {
    const { isModalOpen, header, onClose } = this.props
    return (
      <Modal
        closeIcon
        size="mini"
        open={isModalOpen}
        onClose={onClose}
        style={{
          backgroundColor: lightBg
        }}
      >
        <Modal.Header style={{ color: '#fff' }}>{header}</Modal.Header>
        <Modal.Content>
          <p>Coming soon</p>
        </Modal.Content>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps)(SecurityModal)
