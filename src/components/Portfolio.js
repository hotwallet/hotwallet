import React from 'react'
import { border } from '../lib/styles'
import PricesContainer from '../containers/PricesContainer'
import NetWorthChart from './NetWorthChart'
import PricesFilters from './PricesFilters'
import PortfolioHeader from './PortfolioHeader'

class Settings extends React.PureComponent {
  render() {
    return (
      <div>
        <PortfolioHeader />
        <div className="charts" style={chartsStyle}>
          <NetWorthChart />
        </div>
        <PricesFilters />
        <PricesContainer />
      </div>
    )
  }
}

const chartsStyle = {
  borderBottom: border
}

export default Settings
