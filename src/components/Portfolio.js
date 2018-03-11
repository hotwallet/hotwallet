import React from 'react'
import { connect } from 'react-redux'

const border = '1px solid #49525a'

class Settings extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>Portfolio</h1>
        <div className="charts" style={chartsStyle} />
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
