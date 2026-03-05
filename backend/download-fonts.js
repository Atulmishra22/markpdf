/**
 * download-fonts.js
 * Fetches the Google Fonts CSS (using a Chrome UA so we get woff2),
 * downloads every font binary, base64-encodes each one, and writes
 * backend/lib/fonts-embedded.css — a self-contained @font-face sheet
 * with no external network dependencies.
 *
 * Run once:  node download-fonts.js
 */

'use strict'
const https = require('https')
const fs    = require('fs')
const path  = require('path')

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@' +
  '0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400' +
  '&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600' +
  '&family=JetBrains+Mono:wght@400' +
  '&display=swap'

// Use a Chrome UA so Google Fonts returns woff2 (the most compact format)
const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/122.0.0.0 Safari/537.36'

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = new URL(url)
    https.get({ hostname: opts.hostname, path: opts.pathname + opts.search, headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location, headers).then(resolve).catch(reject)
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end',  () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function main() {
  console.log('Fetching Google Fonts CSS…')
  const cssBuf = await get(GOOGLE_FONTS_URL, { 'User-Agent': CHROME_UA })
  const css    = cssBuf.toString('utf8')

  // Extract all woff2 URLs
  const urlRe  = /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g
  const allUrls = []
  let m
  while ((m = urlRe.exec(css)) !== null) allUrls.push(m[1])

  const unique = [...new Set(allUrls)]
  console.log(`Found ${unique.length} unique font files. Downloading…`)

  // Download all in parallel and build a url→base64 map
  const entries = await Promise.all(
    unique.map(async (url) => {
      const buf    = await get(url, { 'User-Agent': CHROME_UA })
      const b64    = buf.toString('base64')
      const dataUri = `data:font/woff2;base64,${b64}`
      console.log(`  ✓ ${url.split('/').pop()} (${(buf.length / 1024).toFixed(1)} KB)`)
      return [url, dataUri]
    })
  )

  const urlMap = Object.fromEntries(entries)

  // Replace every url(https://...) in the CSS with the base64 data URI
  const embedded = css.replace(
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g,
    (_, u) => `url(${urlMap[u]})`
  )

  // Strip the remaining Google Fonts @import / comments header if any
  const clean = embedded
    .split('\n')
    .filter(l => !l.startsWith('/* [') || true) // keep unicode-range comments
    .join('\n')

  const outPath = path.join(__dirname, 'lib', 'fonts-embedded.css')
  fs.writeFileSync(outPath, clean, 'utf8')

  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(0)
  console.log(`\n✅  Written: lib/fonts-embedded.css  (${sizeKB} KB)`)
  console.log('   All fonts are now fully embedded — no external requests needed.')
}

main().catch(err => { console.error('Error:', err.message); process.exit(1) })
