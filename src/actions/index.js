import { bindActionCreators } from 'redux'

import * as app from './app'
import * as securities from './securities'

export * from './securities'
export * from './counter'

export const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...app,
    ...securities
  }, dispatch)
}
