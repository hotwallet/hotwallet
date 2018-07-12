import React from 'react'
import { Dropdown, Message, Icon, Button } from 'semantic-ui-react'
import { darkBg, lightBg } from '../lib/styles'
import { VelocityComponent, VelocityTransitionGroup } from 'velocity-react'
import { PropTypes } from 'prop-types'
import './NotificationsDropdown.css'

const iconStyle = {
  width: 42,
  height: 42
}

class NotificationsDropdown extends React.PureComponent {
  clearNotification(id) {
    this.props.removeNotification(id)
  }

  getNotificationItems() {
    return this.props.notifications.map(this.getNotificationItem, this)
  }

  getNotificationIcon(notification) {
    if (notification.pending) {
      return <Icon name="circle notch" loading style={iconStyle} />
    } else {
      if (notification.iconSrc) {
        return <img className="icon" style={iconStyle} src={notification.iconSrc} alt="Notification Icon" />
      } else {
        return <Icon name={notification.icon || 'info'} style={iconStyle} />
      }
    }
  }

  getNotificationItem(notification, index) {
    const onDismiss = notification.pending ? undefined : () => {
      this.clearNotification.bind(this, notification.id)()
    }
    return (
      <Dropdown.Item onClick={e => e.stopPropagation()} key={notification.id}>
        <Message icon style={{backgroundColor: lightBg, color: '#eee'}} onDismiss={onDismiss}>
          {this.getNotificationIcon(notification)}
          <Message.Header> {notification.text} </Message.Header>
        </Message>
      </Dropdown.Item>
    )
  }

  render() {
    const isMobile = this.props.isMobile
    const dropdownStyle = isMobile ? {
      backgroundColor: darkBg,
      position: 'fixed',
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      left: 0,
      top: 0,
      zIndex: 300
    } : {
      backgroundColor: darkBg,
      minWidth: 500,
      zIndex: 300
    }

    const len = this.props.notifications.length
    return (
      <VelocityComponent animation={{opacity: 1}}>
        <Dropdown item text={`Messages (${len})`} scrolling={!!isMobile}>
          <Dropdown.Menu as={VelocityTransitionGroup} style={dropdownStyle} leave={{animation: 'slideUp'}}>
            { isMobile && <Dropdown.Item key="close"> <Button inverted style={{width: '100%'}}> Close </Button> </Dropdown.Item> }
            {this.getNotificationItems()}
          </Dropdown.Menu>
        </Dropdown>
      </VelocityComponent>
    )
  }
}

NotificationsDropdown.propTypes = {
  notifications: PropTypes.array.isRequired,
  isMobile: PropTypes.bool,
  removeNotification: PropTypes.func.isRequired
}

export default NotificationsDropdown
