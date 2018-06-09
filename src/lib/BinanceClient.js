import https from 'https'
import crypto from 'crypto'

let _apiKey = Symbol('api key')
let _privateKey = Symbol('private key')

/**
 * Create a sha256 hmac with a provided message and secret
 * @param {string} message
 * @param {string} secret
 * @return {string}
 */
function hmacSHA256(message, secret) {
  return Buffer.from(
    crypto.createHmac('SHA256', secret).update(message).digest('hex')
  ).toString()
}

/**
 * Class representing a binance client used to interact with the binance api
 */
export default class BinanceClient {
  /**
   * Create a binance client
   * @param {string} apiKey The api key of a binance account
   * @param {string} privateKey The private key of the same binance account
   * @param {number} [timeout=5000] The time(in ms) to wait before abandoning an api request
   *
   * @example
   * const client = new BinanceClient('myApiKey', 'myPrivateKey');
   */
  constructor(apiKey, privateKey, timeout = 10000) {
    this[_apiKey] = apiKey
    this[_privateKey] = privateKey
    this.timeout = timeout
  }

  /**
   * Send a request to the binance api
   * @param {string} method The request method (GET, POST, PUT, DELETE)
   * @param {number} apiVersion The binance api version (1, 2, 3 etc)
   * @param {string} endpoint The api endpoint (klines, ticker/24h etc)
   * @param {object} queries The request queries
   * @param {string} [signed] Whether the request must be signed using the api or private key of the account
   * @return {promise}
   * @private
   *
   * @example
   * client._sendRequest('GET', 1, 'ticker/24hr', {
     *     'symbol': 'ETCBTC',
     * }).then((stats) => {
     *      console.log(JSON.parse(stats));
     * });
   */
  _sendRequest(method, apiVersion, endpoint, queries = {}, signed) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'cors-anywhere.herokuapp.com',
        port: 443,
        path: `/https://api.binance.com/api/v${apiVersion}/${endpoint}`,
        method: method,
        timeout: this.timeout,
        headers: {
          'user-agent': 'binance.js'
        }
      }

      if (signed === 'API-KEY' || signed === 'SIGNED') {
        options.headers['x-mbx-apikey'] = this[_apiKey]
      }

      let qs = ''

      let first = true
      for (let prop in queries) {
        if (queries.hasOwnProperty(prop)) {
          if (first) {
            qs += `?${prop}=${queries[prop]}`
            first = false
          } else {
            qs += `&${prop}=${queries[prop]}`
          }
        }
      }

      if (signed === 'SIGNED') {
        queries.timestamp = +Date.now()
        queries.recvWindow = this.timeout

        if (first) {
          qs += `?signature=${hmacSHA256(qs.substr(1), this[_privateKey])}`
          first = false
        } else {
          qs += `&signature=${hmacSHA256(qs.substr(1), this[_privateKey])}`
        }
      }

      options.path += qs

      https.request(options, (response) => {
        let data = ''

        response.on('data', (chunk) => {
          data += chunk
        })

        response.on('end', () => {
          let statusCode = response.statusCode
          let rejectMsg = ''

          if (statusCode.toString().startsWith('4')) {
            rejectMsg = `Client error ${statusCode}: ${JSON.parse(data).msg}`
          } else if (statusCode === '504') {
            rejectMsg = `Unknown error ${statusCode}`
          } else if (statusCode.toString().startsWith('5')) {
            rejectMsg = `Server error: ${statusCode}: ${JSON.parse(data).msg}`
          } else if (JSON.parse(data).code && JSON.parse(data).msg) {
            rejectMsg = JSON.parse(data).msg
          }

          if (rejectMsg) {
            reject(rejectMsg)
          } else {
            resolve(data)
          }
        })
      }).on('error', (e) => {
        reject(e.message)
      }).end()
    })
  }

  /**
   * Get your ping to the binance servers(in ms)
   * @return {promise}
   *
   * @example
   * client.getPing().then((ping) => {
     *     console.log(ping + 'ms'); // 537ms
     * })
   */
  getPing() {
    const before = +new Date()
    return this._sendRequest('GET', 1, 'ping').then(() => {
      return (+new Date() - before)
    })
  }

  /**
   * Get the current time from the binance servers (unix timestamp)
   * @return {promise}
   *
   * @example
   * client.getTime().then((time) => {
     *     console.log(time); // 1508014881691
     *     console.log(new Date(time)); // 2017-10-14T21:01:21.691Z
     * });
   */
  getTime() {
    return this._sendRequest('GET', 1, 'time').then(response => {
      return JSON.parse(response).serverTime
    })
  }

  /**
   * Get user account and asset balances
   * @return {promise}
   */
  getAccount() {
    const timestamp = new Date().getTime()
    return this._sendRequest('GET', 3, 'account', { timestamp }, 'SIGNED').then((res) => {
      return JSON.parse(res)
    })
  }
}
