import React from 'react'
import { connect } from 'react-redux'

class Settings extends React.Component {
  componentDidMount () {}

  render () {
    return (
      <div>
        <h1>Settings</h1>
        <div className="pad">
          <p>Count: {this.props.count}</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  count: state.counter.count
})

export default connect(mapStateToProps)(Settings)
