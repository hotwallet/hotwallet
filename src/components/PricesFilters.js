import React from 'react'
import { connect } from 'react-redux'
import { Checkbox, Input, Grid, Button } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'
import { border, desktopPadding, mobilePadding } from '../lib/styles'

class PricesFilters extends React.Component {
  onToggle(toggle) {
    this.input.inputRef.value = ''
    this.props.filterSymbols('')
    this.props.showBalancesOnly(toggle.checked)
  }
  render() {
    const isMobile = this.props.isMobile
    const padding = isMobile ? mobilePadding : desktopPadding
    return (
      <div style={{
        borderBottom: border,
        padding: `${desktopPadding}px ${padding}px`
      }}>
        <Grid
          columns={3}
          inverted
          divided
        >
          <Grid.Row>
            <Grid.Column width={8}>
              <Input
                icon="search"
                style={{
                  width: isMobile ? 150 : null
                }}
                ref={input => this.input = input}
                defaultValue={this.props.query}
                inverted
                placeholder="Find symbol"
                onChange={e => this.props.filterSymbols(e.target.value)}
              />
            </Grid.Column>
            <Grid.Column width={isMobile ? 8 : 4} textAlign="center">
              <span style={{ color: 'gray', textAlign: 'right' }}>Balances only</span>
              <Checkbox
                checked={this.props.balancesOnly && !this.props.query}
                onChange={(e, toggle) => this.onToggle(toggle)}
                toggle
                style={{
                position: 'relative',
                top: 6,
                left: 8
              }}
              />
            </Grid.Column>
            {isMobile ? null :
              <Grid.Column
                width={4}
                textAlign="center"
              >
                <Button
                  inverted
                  basic
                  compact
                >Import</Button>
              </Grid.Column>
            }
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  balancesOnly: state.securities.balancesOnly,
  query: state.app.filterSymbolsQuery,
  isMobile: state.app.isMobile
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesFilters)
