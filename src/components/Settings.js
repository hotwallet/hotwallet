import React from 'react'
import H1 from './H1'
import { withAccountUpdates } from '../services/db'
import { accountService } from '../services'

function Settings({ _id }) {
  return <>
    <H1 text="Settings" />  
    <div style={{ padding: 25 }}>
      Account ID: {_id}
    </div>
  </>
}

async function getData() {
  return accountService.getPrimaryAccount()
}

function shouldUpdate(change) {
  return change.affects({ isPrimary: true })
}

export default withAccountUpdates(getData, shouldUpdate)(Settings)