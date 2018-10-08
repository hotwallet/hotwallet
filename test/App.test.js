import { launchBrowser } from './puppeteerHelper'

describe('HotWallet', () => {
  test('has correct title', async () => {
    const { page, browser, goto } = await launchBrowser()
    await goto('/')
    await page.waitForSelector('title')
    const html = await page.$eval('title', el => el.innerHTML)
    expect(html).toBe('HotWallet')
    browser.close()
  }, 16000)
})

describe('Fiat selector', () => {
  test('loads correctly', async () => {
    const { page, browser, goto } = await launchBrowser()
    await goto('/')
    await page.waitForSelector('header')
    const html = await page.$eval('header', el => el.innerHTML)
    expect(html).toContain('currency-flag')
    browser.close()
  }, 16000)
})
