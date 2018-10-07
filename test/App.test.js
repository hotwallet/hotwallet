const puppeteer = require('puppeteer')

describe('HotWallet', () => {
  test('HTML loads correctly', async () => {
    let browser = await puppeteer.launch({
      headless: true
    })
    let page = await browser.newPage()
    page.emulate({
      viewport: {
        width: 800,
        height: 800
      },
      userAgent: ''
    })
    await page.goto('http://localhost:5000/')
    await page.waitForSelector('title')
    const html = await page.$eval('title', e => e.innerHTML)
    expect(html).toBe('HotWallet')
    browser.close()
  }, 16000)
})

describe('Fiat selector', () => {
  test('Fiat selector loads correctly', async () => {
    let browser = await puppeteer.launch({
      headless: true
    })
    let page = await browser.newPage()
    page.emulate({
      viewport: {
        width: 800,
        height: 800
      },
      userAgent: ''
    })
    await page.goto('http://localhost:5000/')
    await page.waitForSelector('header')
    const html = await page.$eval('header', e => e.innerHTML)
    expect(html).toContain('currency-flag')
    browser.close()
  }, 16000)
})
