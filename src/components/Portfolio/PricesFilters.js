import React, { useState, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Checkbox, Input, Grid } from 'semantic-ui-react'
import { desktopPadding, mobilePadding } from '../../lib/styles'
import { withTheme, compose } from '../../contexts'
import { useVenti } from 'venti'

import { filterSymbols } from '../../ventiStore/ephemeral'
import { showBalancesOnly } from '../../ventiStore/securities'

function PricesFilters({
  isMobile,
  isTablet
}) {
  const state = useVenti()
  const balancesOnly = state.get('securities.metadata.balancesOnly')
  const query = state.get('ephemeral.filterSymbolsQuery')
  const [value, setValue] = useState('')
  const [hasInput, setInput] = useState('')
  const input = useRef(null)
  console.log('state', state)

  const onToggle = (e, toggle) => {
    input.current.inputRef.value = ''
    filterSymbols('')
    showBalancesOnly(toggle.checked)
  }

  const onSearchFocus = (e) => {
    e.target.select()
    if (isMobile) {
      const node = ReactDOM.findDOMNode(input)
      const viewportOffset = node.getBoundingClientRect()
      setTimeout(() => {
        // allow time for keyboard to open
        window.scrollTo(0, viewportOffset.top - mobilePadding)
      }, 100)
    }
  }

  const onChange = (e) => {
    filterChange(e.target.value)
  }

  const filterChange = (value) => {
    setInput(value !== '')
    setValue(value)
    filterSymbols(value)
  }

  const padding = isMobile ? mobilePadding : desktopPadding

  let inputProps
  if (hasInput) {
    inputProps = {
      action: {
        color: 'grey',
        icon: 'delete',
        onClick: () => filterChange('')
      }
    }
  } else {
    inputProps = { icon: 'search' }
  }

  const toggleHide = balancesOnly ? 'Hiding' : 'Hide'
  const toggleBlanks = isMobile ? 'blanks' : 'blank balances'
  const toggleLabel = `${toggleHide} ${toggleBlanks}`

  return (
    <div style={{
      padding: `${padding}px ${padding}px 0`
    }}>
      <Grid
        columns={2}
        inverted
        divided
        style={{ width: '100%' }}
      >
        <Grid.Row>
          <Grid.Column width={8}>
            <Input
              {...inputProps}
              onFocus={onSearchFocus}
              style={{
                width: isMobile ? 150 : null
              }}
              ref={input}
              inverted
              placeholder="Find symbol"
              onChange={onChange}
              value={value}
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
              {toggleLabel}
              <Checkbox
                checked={balancesOnly && !query}
                onChange={onToggle}
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

export default compose(
  withTheme
)(PricesFilters)
