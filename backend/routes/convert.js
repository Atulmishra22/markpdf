'use strict'
const express          = require('express')
const { parseMarkdown } = require('../lib/markdown')
const { buildTemplate } = require('../lib/template')
const { htmlToPdf }     = require('../lib/pdf')

const router = express.Router()

const MAX_MD_BYTES   = 512 * 1024  // 512 KB hard limit
const MAX_TITLE_LEN  = 200

router.post('/convert', async (req, res) => {
  const { markdown, options = {} } = req.body

  // ── Input validation ──────────────────────────────────────────
  if (typeof markdown !== 'string' || !markdown.trim()) {
    return res.status(400).json({
      error: 'markdown field is required and must be a non-empty string.',
    })
  }

  if (Buffer.byteLength(markdown, 'utf8') > MAX_MD_BYTES) {
    return res.status(413).json({
      error: 'Markdown content exceeds the 512 KB limit.',
    })
  }

  if (options !== null && typeof options !== 'object') {
    return res.status(400).json({ error: 'options must be an object.' })
  }

  // Sanitize title — strip to plain string, cap length
  const rawTitle = typeof options.title === 'string' ? options.title : 'document'
  const title    = rawTitle.replace(/[^\w\s\-_.()]/g, '').trim().slice(0, MAX_TITLE_LEN) || 'document'

  // ── Convert ───────────────────────────────────────────────────
  try {
    const html   = parseMarkdown(markdown)
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
