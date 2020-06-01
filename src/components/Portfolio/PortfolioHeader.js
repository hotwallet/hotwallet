import React from 'react'
import {
  mobilePadding,
  desktopPadding,
  border,
  smallFontSize
} from '../../lib/styles'
import { formatFiat, formatPercentChange } from '../../lib/formatNumber'
import { getBalancesBySymbol } from '../../ventiSelectors/transactions'
import { withTheme, compose } from '../../contexts'
import { useVenti } from 'venti'

function PortfolioHeader({
  isMobile
}) {
  // const state = useVenti()
  const state = useVenti()
  const securities = Object.values(state.get('securities.bySymbol', {}))
  const balancesBySymbol = getBalancesBySymbol()
  const chartData = state.get('portfolio.chartData', {})
  const baseCurrency = state.get(`user.baseCurrency`, '')

  const getTotalValue = () => {
    return Object.keys(balancesBySymbol).reduce((total, symbol) => {
      const security =
        securities &&
        securities.find(
          (s) => s.symbol === symbol && s.baseCurrency === baseCurrency
        )
      if (!security) return total

      return total + balancesBySymbol[symbol] * security.price
    }, 0)
  }

  const getChangeDiv = ({ days }) => {
    const change = formatPercentChange(getChange({ days }))
    return <div style={change.style}>{change.value}</div>
  }

  const getChange = ({ days }) => {
    if (!Array.isArray(chartData)) return 0
    const data = chartData.slice(0).reverse()
    const today = data[0] && data[0][1]
    if (!today) return 0
    const priorDay = data[days] && data[days][1]
    if (!priorDay) return 0
    const change = today - priorDay
    return Math.round((change / priorDay) * 1000) / 10
  }

  const padding = isMobile ? mobilePadding : desktopPadding
  const rowStyle = {
    padding,
    fontSize: 20,
    fontWeight: 100,
    margin: 0,
    borderBottom: border
  }
  const colStyle = {
    display: 'inline-block',
    paddingRight: padding,
    borderRight: border,
    marginRight: padding
  }
  const labelStyle = {
    fontSize: smallFontSize
  }
  return (
    <div style={rowStyle}>
      <div style={colStyle}>
        <div style={labelStyle}>Total value</div>
        <div>{formatFiat(getTotalValue(), baseCurrency)}</div>
      </div>
      <div style={colStyle}>
        <div style={labelStyle}>Today</div>
        {getChangeDiv({ days: 1 })}
      </div>
      <div style={colStyle}>
        <div style={labelStyle}>7 day</div>
        {getChangeDiv({ days: 7 })}
      </div>
      {/*
        <div style={colStyle}>
          <div style={labelStyle}>30 day</div>
          {this.getChangeDiv({ days: 30 })}
        </div>
        */}
    </div>
  )
}

export default compose(withTheme)(PortfolioHeader)
