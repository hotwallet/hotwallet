import React from 'react'
import { connect } from 'react-redux'
import Balances from './Balances'
import H1 from './H1'
import { mapDispatchToProps } from '../actions'
import { getSecurity } from '../selectors/securities'
import { Grid, Image, Icon } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import PriceChart from './PriceChart'

class Symbol extends React.PureComponent {
  componentDidMount() {
    window.scrollTo(0, 0)
  }
  render() {
    const symbol = this.props.security.symbol
    const image = <Image
      src={this.getIcon(symbol)}
      inline
      verticalAlign="middle"
      style={{ marginRight: 12 }}
    />
    return (
      <div>
        <H1
          text={this.props.security.name}
          image={image}
          content={
            <div
              style={{
                verticalAlign: 'middle',
                marginLeft: 15,
                float: 'right',
                cursor: 'pointer'
              }}
              onClick={() => this.props.history.push('/')}
            >
              <Icon name="window close" size="big" />
            </div>
          }
        />
        <Grid>
          <Grid.Column width={11}>
            <PriceChart symbol={symbol} />
          </Grid.Column>
          <Grid.Column width={5}>
            <Balances
              security={this.props.security}
              addManualTransaction={this.props.addManualTransaction}
              removeManualTransactions={this.props.removeManualTransactions}
            />
          </Grid.Column>
        </Grid>
      </div>
    )
  }
  getIcon(symbol) {
    const size = this.props.isMobile ? '16x16' : '32x32'
    return `https://chnnl.imgix.net/tarragon/icons/${size}/${symbol}.png`
  }
}

function mapStateToProps(state, ownProps) {
  const symbol = ownProps.match.params.symbol
  return {
    isMobile: state.ephemeral.isMobile,
    security: getSecurity(state, symbol)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Symbol))
