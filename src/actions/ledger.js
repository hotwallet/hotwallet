import LedgerSDK from 'ledger-sdk'

export const SET_LEDGER_STATUS = 'SET_LEDGER_STATUS'

export const setLedgerStatus = status => ({
  type: SET_LEDGER_STATUS,
  status
})

export const startLedger = () => (dispatch, getState) => {
  const ledger = new LedgerSDK()

  // reset to disconnected status on start
  dispatch(setLedgerStatus(null))

  ledger.on('open', data => dispatch(setLedgerStatus(data)))

  ledger.on('close', () => dispatch(setLedgerStatus(null)))

  ledger.on('disconnect', () => console.log('disconnect'))

  ledger.start()
}
