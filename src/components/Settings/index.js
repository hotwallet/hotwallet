import React from 'react'
import Settings from './Settings'
import { accountService } from '../../services'
import { withState } from '../../ventiStore'
import { compose, withTheme } from '../../contexts'

const createAccount = () => accountService.createAccount()

const SettingsContainer = props => React.createElement(Settings, props)

const getProps = (state, props) => ({
  accounts: state.get('accounts'),
  createAccount
})

const withProps = compose(
  withTheme,
  withState(getProps)
)

export default withProps(SettingsContainer)
