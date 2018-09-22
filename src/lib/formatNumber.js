const g = global || window
const language = (g.navigator && g.navigator.language) || 'en-US'

// based on https://stackoverflow.com/a/1581007
export function roundToSignificantFigures(num, digits = 3) {
  if (num === 0) {
    return 0
  }
  const l = Math.ceil(Math.log10(Math.abs(num)))
  const power = digits - l
  const magnitude = Math.pow(10, power)
  const shifted = Math.round(num * magnitude)
  return shifted / magnitude
}

export function formatBalance(num) {
  const sigFigs = 3
  if (String(num).split('.')[0].length >= sigFigs) {
    return Math.round(num)
  }
  return roundToSignificantFigures(num)
}

export function formatFiat(num, currency) {
  const currencyOptions = {
    style: 'currency',
    currency
  }
  if (num >= 1000) {
    return num.toLocaleString(language, Object.assign({
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }, currencyOptions))
  }
  if (num >= 1) {
    return num.toLocaleString(language, currencyOptions)
  }
  const symbol = Number(0).toLocaleString(language, currencyOptions).substr(0, 1)
  return symbol + roundToSignificantFigures(Number(num))
}

export function shortenLargeNumber(num, baseCurrency) {
  const units = ['k', 'M', 'B', 'T']
  let decimal
  const symbol = (typeof baseCurrency === 'string')
    ? Number(0).toLocaleString('en-US', {
      style: 'currency',
      currency: baseCurrency
    }).substr(0, 1)
    : ''
  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1)
    if (num <= -decimal || num >= decimal) {
      const number = num / decimal
      return symbol + (number > 100 ? number.toFixed(0) : number.toFixed(1)) + units[i]
    }
  }
  const formattedNum = (num < 1000) ? Math.round(num) : num
  return `${symbol}${formattedNum}`
}

export function formatPercentChange(num) {
  if (Number(num) > 0) {
    return {
      style: { color: 'lightgreen' },
      value: `+${num}%`
    }
  }
  if (Number(num) < 0) {
    return {
      style: { color: 'red' },
      value: `${num}%`
    }
  }
  return {
    style: {},
    value: '-'
  }
}
