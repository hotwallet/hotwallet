import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { mapDispatchToProps } from '../actions'

import H1 from './H1'

class Settings extends React.Component {
  render() {
    return (
      <div>
        <H1 text="Settings" />
        <Button onClick={this.props.generateKeys}> Generate Keys </Button>
      </div>
    )
  }
}

const mapStateToProps = state => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
