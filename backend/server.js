'use strict'
const express    = require('express')
const helmet     = require('helmet')
const cors       = require('cors')
const rateLimit  = require('express-rate-limit')
const convertRouter = require('./routes/convert')

const app  = express()
const PORT = process.env.PORT || 3001

// Security headers — CSP off because our PDF template loads Google Fonts
app.use(helmet({ contentSecurityPolicy: false }))

// CORS — allow only the Vite dev server and preview server
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  methods: ['GET', 'POST'],
}))

// JSON body — hard cap at 512 KB to prevent oversized payloads
app.use(express.json({ limit: '512kb' }))

// Convert rate limit — protect PDF generation endpoint.
const convertLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — please wait a moment.' },
})

// Preview rate limit — higher threshold because preview updates while typing.
const previewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 240,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Preview rate limit reached — pause typing for a moment.' },
})

app.use('/api/convert', convertLimiter)
app.use('/api/preview', previewLimiter)

app.use('/api', convertRouter)

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Global error handler — never leak stack traces to client
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`MarkPDF API listening on http://localhost:${PORT}`)
})

module.exports = app
