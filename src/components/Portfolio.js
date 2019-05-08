import React from 'react'
import { connect } from 'react-redux'
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
        <PricesContainer history={this.props.history} />
      </div>
    )
  }
}

const chartsStyle = {
  borderBottom: border
}

const mapStateToProps = (state, ownProps) => ({
  history: ownProps.history
})

export default connect(mapStateToProps)(Settings)
