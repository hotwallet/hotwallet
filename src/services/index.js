import db from './db'
import AccountService from './AccountService'
import AssetService from './AssetService'
import TransactionService from './TransactionService'
import WalletService from './WalletService'

export const accountService = new AccountService({ db })
export const assetService = new AssetService({ db, accountService })
export const transactionService = new TransactionService({ db })
export const walletService = new WalletService({ db })
