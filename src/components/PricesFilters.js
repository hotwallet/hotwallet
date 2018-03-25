import React from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'semantic-ui-react'
import { bindActionCreators } from 'redux'
import { showBalancesOnly } from '../actions/securities'

class PricesFilters extends React.Component {
  render() {
    return (
      <div className="cf" style={{ marginBottom: 20 }}>
        <div style={{
          float: 'right',
          marginRight: 10
        }}>
          <span style={{ color: 'gray' }}>Balances only</span>
          <Checkbox
            checked={this.props.balancesOnly}
            onChange={(e, result) => this.props.showBalancesOnly(result.checked)}
            toggle
            style={{
              position: 'relative',
              top: 6,
              left: 8
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  balancesOnly: state.securities.balancesOnly
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      showBalancesOnly
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(PricesFilters)
