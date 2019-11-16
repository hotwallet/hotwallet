import * as React from 'react'

const defaultValue = {}

export const ThemeContext = React.createContext(defaultValue)

export function withTheme(Component) {
  return function ThemeComponent(props) {
    return (
      <ThemeContext.Consumer>
        {(contexts) => <Component {...props} {...contexts} />}
      </ThemeContext.Consumer>
    )
  }
}

export class ThemeProvider extends React.Component {
  constructor() {
    super()
    this.state = defaultValue
  }

  componentDidMount() {
    this.throttleWindowChange()
    this.resizeTimer = null
    window.addEventListener('resize', this.throttleWindowChange)
  }

  throttleWindowChange = () => {
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => this.onResize(), 100)
  }

  onResize() {
    const width = document.body.clientWidth
    const isMobile = (width <= 765)
    const isTablet = (width > 765 && width < 1165)
    const isDesktop = (width >= 1165)
    const device = {
      isMobile,
      isTablet,
      isDesktop,
      deviceWidth: width,
      deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
    }
    this.setState(device)
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    )
  }
}