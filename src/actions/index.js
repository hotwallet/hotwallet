import { bindActionCreators } from 'redux'

import * as ephemeral from './ephemeral'
import * as portfolio from './portfolio'
import * as securities from './securities'
import * as transactions from './transactions'
import * as trezor from './trezor'
import * as wallets from './wallets'

export const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...ephemeral,
    ...portfolio,
    ...securities,
    ...transactions,
    ...trezor,
    ...wallets
  }, dispatch)
}
