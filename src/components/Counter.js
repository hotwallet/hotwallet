import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class Counter extends React.Component {
  componentDidMount() {}

  render() {
    const props = this.props
    return (
      <div>
        <h1>Count: {props.count}</h1>

        <div className="pad">
          <p>
            <button onClick={props.increment}>Increment {props.size}</button>
          </p>

          <p>
            <button onClick={props.decrement}>Decrement {props.size}</button>
          </p>

          <input
            type="number"
            defaultValue={props.size}
            onChange={e => props.setSize(e.target.value)}
          />

          <p>
            <button onClick={() => props.goto('/settings')}>
              Go to Settings
            </button>
          </p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  count: state.counter.count,
  size: state.counter.size
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment: () => ({ type: 'counter.increment' }),
      decrement: () => ({ type: 'counter.decrement' }),
      setSize: size => ({ type: 'counter.setSize', size }),
      goto: uri => push(uri)
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
