'use strict'
const puppeteer = require('puppeteer')

let _browser = null

async function getBrowser() {
  if (!_browser) {
    _browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })
    _browser.on('disconnected', () => { _browser = null })
  }
  return _browser
}

/**
 * Converts an HTML string to a PDF buffer (A4).
 *
 * Security:
 *  - JS is disabled inside the page — the template has no scripts and does not need them.
 *  - Request interception blocks file:// and data: URIs to prevent SSRF via local paths.
 */
async function htmlToPdf(html, { headerTemplate = '<span></span>' } = {}) {
  const browser = await getBrowser()
  const page    = await browser.newPage()

  try {
    // Disable JS — template is pure HTML/CSS
    await page.setJavaScriptEnabled(false)

    // Block dangerous URL schemes (SSRF guard)
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const url = req.url()
      if (url.startsWith('file://') || url.startsWith('data:')) {
        req.abort('blockedbyclient')
      } else {
        req.continue()
      }
    })

    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 20000 })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate: `
        <div style="
          width: 100%;
          padding: 0 80px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #e8e6f0;
          font-family: 'Courier New', monospace;
          font-size: 8pt;
          color: #c4c1d4;
        ">
          <span>// markpdf.dev</span>
          <span><span class="pageNumber"></span> / <span class="totalPages"></span></span>
        </div>`,
      margin: { top: '60px', right: '0px', bottom: '48px', left: '0px' },
    })

    return pdf
  } finally {
    await page.close()
  }
}

// Graceful shutdown — close Chromium when the Node process exits
async function closeBrowser() {
  if (_browser) {
    await _browser.close()
    _browser = null
  }
}

process.on('exit',    () => closeBrowser())
process.on('SIGINT',  () => closeBrowser().then(() => process.exit(0)))
process.on('SIGTERM', () => closeBrowser().then(() => process.exit(0)))

module.exports = { htmlToPdf }
