import { bindActionCreators } from 'redux'

import * as app from './app'
import * as binance from './binance'
import * as securities from './securities'
import * as portfolio from './portfolio'
import * as transactions from './transactions'
import * as user from './user'

export const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...app,
    ...binance,
    ...portfolio,
    ...securities,
    ...transactions,
    ...user
  }, dispatch)
}
