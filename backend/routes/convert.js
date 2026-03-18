'use strict'
const express          = require('express')
const { parseMarkdown } = require('../lib/markdown')
const { parseTex }      = require('../lib/latex')
const { buildTemplate } = require('../lib/template')
const { htmlToPdf }     = require('../lib/pdf')

const router = express.Router()

const MAX_INPUT_BYTES = 512 * 1024  // 512 KB hard limit
const MAX_TITLE_LEN   = 200
const VALID_FORMATS   = new Set(['markdown', 'tex'])

function getNormalizedPayload(body = {}) {
  const { markdown, tex, content, format = 'markdown', options = {} } = body
  const normalizedFormat = typeof format === 'string' ? format.toLowerCase() : ''
  const source = typeof content === 'string'
    ? content
    : (normalizedFormat === 'tex' ? tex : markdown)

  return { normalizedFormat, source, options }
}

function validateInput({ normalizedFormat, source, options }, { requireOptions = false } = {}) {
  if (!VALID_FORMATS.has(normalizedFormat)) {
    return { status: 400, error: 'format must be either "markdown" or "tex".' }
  }

  if (typeof source !== 'string' || !source.trim()) {
    return {
      status: 400,
      error: 'content must be a non-empty string (or provide markdown/tex based on format).',
    }
  }

  if (Buffer.byteLength(source, 'utf8') > MAX_INPUT_BYTES) {
    return { status: 413, error: 'Input content exceeds the 512 KB limit.' }
  }

  if (requireOptions && options !== null && typeof options !== 'object') {
    return { status: 400, error: 'options must be an object.' }
  }

  return null
}

function parseByFormat(normalizedFormat, source) {
  return normalizedFormat === 'tex'
    ? parseTex(source)
    : parseMarkdown(source)
}

router.post('/preview', async (req, res) => {
  const payload = getNormalizedPayload(req.body)
  const validation = validateInput(payload)

  if (validation) {
    return res.status(validation.status).json({ error: validation.error })
  }

  try {
    const html = parseByFormat(payload.normalizedFormat, payload.source)
    res.set({
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    })
    res.json({ html })
  } catch (err) {
    console.error('[preview error]', err.message)
    res.status(500).json({ error: 'Preview rendering failed. Please try again.' })
  }
})

router.post('/convert', async (req, res) => {
  const payload = getNormalizedPayload(req.body)
  const { normalizedFormat, source, options } = payload

  // ── Input validation ──────────────────────────────────────────
  const validation = validateInput(payload, { requireOptions: true })
  if (validation) {
    return res.status(validation.status).json({ error: validation.error })
  }

  // Sanitize title — strip to plain string, cap length
  const rawTitle = typeof options.title === 'string' ? options.title : 'document'
  const title    = rawTitle.replace(/[^\w\s\-_.()]/g, '').trim().slice(0, MAX_TITLE_LEN) || 'document'

  // ── Convert ───────────────────────────────────────────────────
  try {
    const html = parseByFormat(normalizedFormat, source)

    const { html: tpl, headerTemplate } = buildTemplate(html, { title })
    const pdfBuf = await htmlToPdf(tpl, { headerTemplate })

    res.set({
      'Content-Type':        'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.pdf"`,
      'Content-Length':      pdfBuf.length,
      'Cache-Control':       'no-store',
      'X-Content-Type-Options': 'nosniff',
    })
    res.end(pdfBuf)

  } catch (err) {
    console.error('[convert error]', err.message)
    res.status(500).json({ error: 'PDF conversion failed. Please try again.' })
  }
})

module.exports = router
