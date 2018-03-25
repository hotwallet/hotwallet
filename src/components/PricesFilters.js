import React from 'react'
import { connect } from 'react-redux'

class PricesFilters extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = state => ({
  baseCurrency: state.user.baseCurrency
})

export default connect(mapStateToProps)(PricesFilters)
