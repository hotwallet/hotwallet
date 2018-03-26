import React from 'react'
import { connect } from 'react-redux'
import { border } from '../lib/styles'
import Prices from './Prices'
import NetWorthChart from './NetWorthChart'
import PricesFilters from './PricesFilters'
import H1 from './H1'

class Settings extends React.Component {
  render() {
    return (
      <div>
        <H1 text="Portfolio" />
        <div className="charts" style={chartsStyle}>
          <NetWorthChart />
        </div>
        <PricesFilters />
        <Prices />
      </div>
    )
  }
}

const chartsStyle = {
  borderBottom: border
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps)(Settings)
