import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Checkbox, Input, Grid } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'
import { desktopPadding, mobilePadding } from '../lib/styles'

class PricesFilters extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
    this.onChange = this.onChange.bind(this)
    this.filterChange = this.filterChange.bind(this)
    this.onSearchFocus = this.onSearchFocus.bind(this)
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle(e, toggle) {
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

  onChange(e) {
    this.filterChange(e.target.value)
  }

  filterChange(value) {
    this.setState({
      hasInput: value !== '',
      value: value
    })
    this.props.filterSymbols(value)
  }

  render() {
    const isMobile = this.props.isMobile
    const isTablet = this.props.isTablet
    const padding = isMobile ? mobilePadding : desktopPadding

    let inputProps
    if (this.state.hasInput) {
      inputProps = {
        action: {
          color: 'grey',
          icon: 'delete',
          onClick: () => this.filterChange('')
        }
      }
    } else {
      inputProps = { icon: 'search' }
    }

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
                {...inputProps}
                onFocus={this.onSearchFocus}
                style={{
                  width: isMobile ? 150 : null
                }}
                ref={input => { this.input = input }}
                defaultValue={this.props.query}
                inverted
                placeholder="Find symbol"
                onChange={this.onChange}
                value={this.state.value}
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
                {this.props.balancesOnly ? 'Hiding' : 'Hide'} empty balances
                <Checkbox
                  checked={this.props.balancesOnly && !this.props.query}
                  onChange={this.onToggle}
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
  balancesOnly: state.securities.metadata.balancesOnly,
  query: state.app.filterSymbolsQuery,
  isMobile: state.app.isMobile,
  isTablet: state.app.isTablet
})

export default connect(mapStateToProps, mapDispatchToProps)(PricesFilters)
