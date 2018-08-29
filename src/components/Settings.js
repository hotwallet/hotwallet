import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'

import H1 from './H1'

class Settings extends React.Component {
  addSomeNotifications() {
    // this.props.addNotification({pending: true, text: 'This is a pending notification'})
    this.props.addNotification({text: 'This is a finished notification', icon: 'heart'})
    this.props.addNotification({text: 'Two notifications added', iconSrc: 'https://chnnl.imgix.net/tarragon/icons/64x64/BTC.png'})
  }

  render() {
    const buttonStyle = {
      margin: 10
    }

    return (
      <div>
        <H1 text="Settings" />
        <Button style={buttonStyle} onClick={this.addSomeNotifications.bind(this)} inverted> Add some notifications </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
