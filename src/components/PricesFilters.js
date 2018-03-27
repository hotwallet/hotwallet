import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Checkbox, Input, Grid } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'
import { desktopPadding, mobilePadding } from '../lib/styles'

class PricesFilters extends React.Component {
  onToggle(toggle) {
    this.input.inputRef.value = ''
    this.props.filterSymbols('')
    this.props.showBalancesOnly(toggle.checked)
  }

  onSearchFocus(e) {
    e.target.select()
    if (this.props.isMobile) {
      const node = ReactDOM.findDOMNode(this.input)
      const viewportOffset = node.getBoundingClientRect()
      setTimeout(() => {
        // allow time for keyboard to open
        window.scrollTo(0, viewportOffset.top - mobilePadding)
      }, 100)
    }
  }

  render() {
    const isMobile = this.props.isMobile
    const isTablet = this.props.isTablet
    const padding = isMobile ? mobilePadding : desktopPadding
    return (
      <div style={{
        padding: `${padding}px ${padding}px 0`
      }}>
        <Grid
          columns={2}
          inverted
          divided
        >
          <Grid.Row>
            <Grid.Column width={8}>
              <Input
                icon="search"
                onFocus={e => this.onSearchFocus(e)}
                style={{
                  width: isMobile ? 150 : null
                }}
                ref={input => { this.input = input }}
                defaultValue={this.props.query}
                inverted
                placeholder="Find symbol"
                onChange={e => this.props.filterSymbols(e.target.value)}
              />
            </Grid.Column>
            <Grid.Column
              width={8}
              textAlign="right"
            >
              <label
                style={{
                  color: 'gray',
                  textAlign: 'right',
                  cursor: 'pointer'
                }}
              >
                Balances only
                <Checkbox
                  checked={this.props.balancesOnly && !this.props.query}
                  onChange={(e, toggle) => this.onToggle(toggle)}
                  toggle
                  style={{
                    position: 'relative',
                    top: 6,
                    left: 10,
                    marginRight: isTablet ? padding : isMobile ? 20 : 0
                  }}
                />
              </label>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  balancesOnly: state.securities.balancesOnly,
  query: state.app.filterSymbolsQuery,
  isMobile: state.app.isMobile,
  isTablet: state.app.isTablet
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesFilters)
