import React from 'react'
import { connect } from 'react-redux'
import { border } from '../lib/styles'
import Prices from './Prices'
import NetWorthChart from './NetWorthChart'

class Settings extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>Portfolio</h1>
        <div className="charts" style={chartsStyle}>
          <NetWorthChart />
        </div>
        <Prices />
      </div>
    )
  }
}

const chartsStyle = {
  borderBottom: border
}

const mapStateToProps = state => ({
  count: state.counter.count
})

export default connect(mapStateToProps)(Settings)
