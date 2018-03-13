import React from 'react'
import { connect } from 'react-redux'
import { border } from '../lib/styles'
import Prices from './Prices'

class Settings extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>Portfolio</h1>
        <div className="charts" style={chartsStyle} />
        <Prices />
      </div>
    )
  }
}

const chartsStyle = {
  borderBottom: border,
  height: 300
}

const mapStateToProps = state => ({
  count: state.counter.count
})

export default connect(mapStateToProps)(Settings)
