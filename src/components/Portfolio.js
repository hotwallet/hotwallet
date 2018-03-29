import React from 'react'
import { connect } from 'react-redux'
import { border } from '../lib/styles'
import Prices from './Prices'
import NetWorthChart from './NetWorthChart'
import PricesFilters from './PricesFilters'
import PortfolioHeader from './PortfolioHeader'

class Settings extends React.Component {
  render() {
    return (
      <div>
        <PortfolioHeader />
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
