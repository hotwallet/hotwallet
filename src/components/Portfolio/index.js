import React from 'react'
import { border } from '../../lib/styles'
import PricesContainer from '../../containers/PricesContainer'
import NetWorthChart from './NetWorthChart'
import PricesFilters from './PricesFilters'
import PortfolioHeader from './PortfolioHeader'

class Portfolio extends React.PureComponent {
  render() {
    return (
      <div>
        <PortfolioHeader />
        <div className="charts" style={{ borderBottom: border }}>
          <NetWorthChart />
        </div>
        <PricesFilters />
        <PricesContainer />
      </div>
    )
  }
}

export default Portfolio
