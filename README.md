<div width="100%" style="padding:25px 0; background-color:#1c242a;">
  <img style="display: block; margin:auto;" src="https://hotwallet.com/hotwallet-144x144.png" />
</div>

# HotWallet
Crypto Platform

[![CircleCI](https://circleci.com/gh/hotwallet/hotwallet.svg?style=svg&circle-token=19f992cd74dd31acc5b238e8099be75c6ada94f6)](https://circleci.com/gh/hotwallet/hotwallet)

## Features

- No login
- Manage wallets and exchange accounts
- Ledger and Trezor support
- HotWallet App Store ([Apps API](https://github.com/hotwallet/hotwallet/wiki/HotWallet-Apps-API))
- Sync devices (coming soon)

## Install

```bash
git clone git@github.com:hotwallet/hotwallet.git
cd hotwallet
yarn
```

## Start web app

```bash
yarn start
# yarn start-ssl
```

## Run tests

```bash
yarn start
yarn test --watch
```

## Start iOS app

```bash
yarn global add cordova
yarn ios
```
