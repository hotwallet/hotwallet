import { bindActionCreators } from 'redux'

import * as apps from './apps'
import * as binance from './binance'
import * as ephemeral from './ephemeral'
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
    ...apps,
    ...binance,
    ...ephemeral,
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
