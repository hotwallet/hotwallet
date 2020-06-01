import { state } from 'venti'
import AccountService from './AccountService'
import AssetService from './AssetService'
import TransactionService from './TransactionService'
import WalletService from './WalletService'

export const accountService = new AccountService({ state })
export const assetService = new AssetService({ state, accountService })
export const transactionService = new TransactionService({ state })
export const walletService = new WalletService({ state, accountService })
