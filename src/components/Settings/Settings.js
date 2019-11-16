import React from 'react'
import H1 from '../H1'

export default function Settings({ accounts, createAccount, deviceWidth }) {
  return <>
    <H1 text="Settings" />
    <div>
      {Object.keys(accounts).map(accountId => (
        <div key={accountId}>{accountId} {accounts[accountId].isPrimary ? '(primary)' : ''}</div>
      ))}
    </div>
    <button onClick={createAccount}>Create Account</button>
    <div style={{ padding: 25 }}>
      width: {deviceWidth}
    </div>
  </>
}
