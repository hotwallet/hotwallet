import { bindActionCreators } from 'redux'

import * as app from './app'
import * as binance from './binance'
import * as ledger from './ledger'
import * as portfolio from './portfolio'
import * as prices from './prices'
import * as securities from './securities'
import * as transactions from './transactions'
import * as trezor from './trezor'
import * as user from './user'
import * as wallets from './wallets'

export const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    ...app,
    ...binance,
    ...ledger,
    ...portfolio,
    ...prices,
    ...securities,
    ...transactions,
    ...trezor,
    ...user,
    ...wallets
  }, dispatch)
}
