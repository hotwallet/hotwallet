import React from 'react'
import { connect } from 'react-redux'
import H1 from './H1'

class Settings extends React.Component {
  render() {
    return (
      <div>
        <H1 text="Settings" />
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Settings)
