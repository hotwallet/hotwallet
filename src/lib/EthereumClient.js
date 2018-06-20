import cheerio from 'cheerio'
import cloudscraper from 'cloudscraper'

const corsAnywhere = 'cors-anywhere.herokuapp.com'

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
    const url = `https://${corsAnywhere}/https://etherscan.io/tokenholdings?a=${address}`
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
