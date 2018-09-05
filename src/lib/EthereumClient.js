import cheerio from 'cheerio'
import cloudscraper from 'cloudscraper'
import Idiot from 'idiot'

const corsAnywhere = 'https://cors-anywhere.herokuapp.com'

const client = new Idiot({
  baseUrl: 'https://api.hotwallet.com/proxy/http://api.ethplorer.io'
})

export default class EthereumClient {
  async getHtml(url) {
    return new Promise((resolve, reject) => {
      cloudscraper.get(url, (err, response, body) => {
        if (err) {
          return reject(err)
        }
        return resolve(body)
      })
    })
  }

  async getBalances(address) {
    const tokenBalances = []
    const data = await client.get(`/getAddressInfo/${address}?apiKey=freekey`)
    tokenBalances.push({ symbol: 'ETH', balance: data.ETH.balance })
    data.tokens.forEach(token => {
      const symbol = token.tokenInfo.symbol
      const balance = token.balance / Math.pow(10, Number(token.tokenInfo.decimals))
      tokenBalances.push({ symbol, balance })
    })
    return tokenBalances
  }

  async getEtherscanBalances(address) {
    const url = `${corsAnywhere}/https://etherscan.io/tokenholdings?a=${address}`
    const body = await this.getHtml(url)
    const $ = cheerio.load(body)
    const $tr = $('table.table tbody tr')
    const tokenBalances = []
    $tr.each(function () {
      const $this = $(this)
      const $td = $this.find('td')
      const [balanceStr, symbol] = $($td[3]).text().trim().split(' ')
      const balance = Number(balanceStr.replace(',', ''))
      if (balance) {
        tokenBalances.push({ symbol, balance })
      }
    })
    return tokenBalances
  }
}
