import React from 'react'
import { connect } from 'react-redux'
import { mapDispatchToProps } from '../actions'
import { getNotificationList } from '../selectors/notificationSelectors'
import NotificationsDropdown from '../components/NotificationsDropdown'

class NotificationsContainer extends React.Component {
  render() {
    return React.createElement(NotificationsDropdown, {
      notifications: this.props.notifications,
      isMobile: this.props.isMobile,
      removeNotification: this.props.removeNotification
    })
  }
}

const mapStateToProps = state => ({
  notifications: getNotificationList(state),
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsContainer)
