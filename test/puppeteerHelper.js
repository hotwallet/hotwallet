const puppeteer = require('puppeteer')

const PORT = process.env.PORT || 5000
const URL = `http://localhost:${PORT}`

export const launchBrowser = async function ({
  headless = true,
  width = 800,
  height = 400,
  userAgent = ''
} = {}) {
  const browser = await puppeteer.launch({ headless })
  const page = await browser.newPage()
  page.emulate({
    viewport: { width, height },
    userAgent
  })
  const goto = (uri) => page.goto(`${URL}${uri}`)
  return { browser, page, goto }
}
