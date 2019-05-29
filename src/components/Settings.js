import React from 'react'
import H1 from './H1'
import { connectAccounts } from '../db'
import { accountService } from '../services'
import { compose, withTheme } from '../contexts'

function Settings({ _id, deviceWidth }) {
  return <>
    <H1 text="Settings" />
    <div style={{ padding: 25 }}>
      Account ID: {_id}
    </div>
    <div style={{ padding: 25 }}>
      width: {deviceWidth}
    </div>
  </>
}

async function getData() {
  return accountService.getPrimaryAccount()
}

function shouldUpdate(change) {
  return change.affects({ isPrimary: true })
}

export default compose(
  withTheme,
  connectAccounts(getData, shouldUpdate)
)(Settings)
