import React from 'react'
import { connect } from 'react-redux'
import H1 from './H1'
import { mobilePadding, desktopPadding } from '../lib/styles'
import { mapDispatchToProps } from '../actions'

class Ledger extends React.Component {
  componentDidMount() {
    this.props.startLedger()
  }

  renderInstructions() {
    return (
      <ol>
        <li>Plug in and unlock your Ledger</li>
        <li>Choose currency on your device</li>
      </ol>
    )
  }

  renderLedgerStatus() {
    const symbol = this.props.status.symbol
    if (!symbol) {
      //return this.renderInstructions()
      return (
        <div>
          <div>Coming soon</div>
        </div>
      )
    }
    return (
      <div>
        <div>Coming soon</div>
        <div>{symbol} connected</div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <H1 text="Ledger Connect" />
        <div
          style={{
            padding: this.props.isMobile ? mobilePadding : desktopPadding
          }}
        >
          <div className="ui divided stackable two column grid">
            <div className="column">
              {this.renderLedgerStatus()}
            </div>
            <div className="column">

            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isMobile: state.app.isMobile,
  status: state.ledger.status || {}
})

export default connect(mapStateToProps, mapDispatchToProps)(Ledger)
