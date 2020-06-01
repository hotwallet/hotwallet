import client from './hotwalletClient'
import React from 'react'
import isEqual from 'lodash/isEqual'

export function subscribeSymbol(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      this.subscribe()
    }

    componentDidUpdate(prevProps) {
      if (prevProps.symbol !== this.props.symbol) {
        this.unsubscribe && this.unsubscribe()
        this.subscribe()
      }
    }

    componentWillUnmount() {
      this.unsubscribe && this.unsubscribe()
    }

    subscribe() {
      if (this.props.symbol) {
        this.unsubscribe = client.socket.subscribe(this.props.symbol)
      } else {
        throw new Error('No symbol to subscribe to')
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export function subscribeSymbols(WrappedComponent) {
  return class extends React.Component {
    componentDidMount() {
      this.subscribe()
    }

    componentDidUpdate(prevProps) {
      if (prevProps.symbols !== this.props.symbols && !isEqual(prevProps.symbols, this.props.symbols)) {
        this.unsubscribe && this.unsubscribe()
        this.subscribe()
      }
    }

    componentWillUnmount() {
      this.unsubscribe && this.unsubscribe()
    }

    subscribe() {
      if (this.props.symbols) {
        this.unsubscribe = client.socket.subscribeAll(this.props.symbols)
      } else {
        throw new Error('No symbols to subscribe to')
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}

export function symbolsFromStore(getSymbols) {
  if (!getSymbols) throw Error('Symbols getter should be provided')
  return WrappedComponent => {
    const symbols = getSymbols()
    return props => (<WrappedComponent {...{ ...props, symbols }} />)
  }
}
