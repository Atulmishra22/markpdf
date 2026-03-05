'use strict'
const fs   = require('fs')
const path = require('path')

// Load the self-contained @font-face CSS once at startup (no network calls ever)
const FONTS_CSS = fs.readFileSync(
  path.join(__dirname, 'fonts-embedded.css'), 'utf8'
)

/**
 * Builds the full HTML document that Puppeteer will render to PDF.
 * Uses the same brand font stack and accent color (#7C6FFF) as the landing page.
 * All fonts are embedded as base64 — zero external requests, fully offline-capable.
 */
function buildTemplate(contentHtml, { title = 'Document' } = {}) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const headerTemplate = `
    <div style="width:100%;padding:0 80px;box-sizing:border-box;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e8e6f0;">
      <div style="display:flex;align-items:center;gap:8px;">
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width="26" height="26" rx="5" stroke="#7C6FFF" stroke-width="1.5"/>
          <rect x="5" y="8" width="18" height="1.5" rx="0.75" fill="#7C6FFF"/>
          <rect x="5" y="12" width="14" height="1.5" rx="0.75" fill="#9d9ab0"/>
          <rect x="5" y="16" width="16" height="1.5" rx="0.75" fill="#9d9ab0"/>
          <rect x="5" y="20" width="10" height="1.5" rx="0.75" fill="#c4c1d4"/>
        </svg>
        <span style="font-family:'Courier New',monospace;font-size:9pt;color:#9d9ab0;letter-spacing:0.1em;text-transform:uppercase;">MarkPDF</span>
      </div>
      <span style="font-family:'Courier New',monospace;font-size:9pt;color:#c4c1d4;">${dateStr}</span>
    </div>`

  const html = /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>${FONTS_CSS}

    @page {
      size: A4;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
      font-size: 10.5pt;
      line-height: 1.75;
      color: #1a1927;
      background: #ffffff;
      padding: 20px 80px 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Headings ──────────────────────────────────────────────── */
    h1 {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 26pt;
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.025em;
      color: #0d0c1a;
      margin-top: 0;
      margin-bottom: 22pt;
      padding-bottom: 14pt;
      border-bottom: 2px solid #7C6FFF;
    }

    h2 {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 16pt;
      font-weight: 600;
      line-height: 1.3;
      letter-spacing: -0.015em;
      color: #0d0c1a;
      margin-top: 30pt;
      margin-bottom: 10pt;
      padding-left: 12pt;
      border-left: 3px solid #7C6FFF;
    }

    h3 {
      font-family: 'Fraunces', Georgia, serif;
      font-size: 12.5pt;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #1a1927;
      margin-top: 22pt;
      margin-bottom: 7pt;
    }

    h4, h5, h6 {
      font-family: 'DM Sans', sans-serif;
      font-size: 10.5pt;
      font-weight: 600;
      color: #1a1927;
      margin-top: 16pt;
      margin-bottom: 5pt;
    }

    /* ── Body text ─────────────────────────────────────────────── */
    p {
      margin-bottom: 10pt;
      color: #2d2b3e;
    }

    strong { font-weight: 600; color: #0d0c1a; }
    em     { font-style: italic; }

    a {
      color: #6257e8;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-underline-offset: 2px;
    }

    hr {
      border: none;
      border-top: 1px solid #e8e6f0;
      margin: 24pt 0;
    }

    /* ── Lists ─────────────────────────────────────────────────── */
    ul, ol {
      margin: 8pt 0 10pt 20pt;
    }

    li {
      margin-bottom: 4pt;
      color: #2d2b3e;
    }

    li + li { margin-top: 3pt; }

    /* ── Blockquote ────────────────────────────────────────────── */
    blockquote {
      border-left: 3px solid #7C6FFF;
      background: #f7f5ff;
      padding: 12pt 16pt;
      margin: 14pt 0;
      border-radius: 0 4px 4px 0;
    }

    blockquote p { color: #4a4766; margin-bottom: 0; }

    /* ── Code ──────────────────────────────────────────────────── */
    code {
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 9pt;
      background: #f2f0ff;
      color: #5245c7;
      padding: 1.5pt 5pt;
      border-radius: 3px;
    }

    pre {
      background: #f7f6ff;
      border: 1px solid #e4e1f5;
      border-left: 3px solid #7C6FFF;
      border-radius: 4px;
      padding: 14pt 16pt;
      margin: 12pt 0;
      overflow: hidden;
      page-break-inside: avoid;
    }

    pre code {
      background: none;
      color: #2d2b3e;
      padding: 0;
      font-size: 9pt;
      white-space: pre;
    }

    /* ── Tables ────────────────────────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12pt 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }

    thead { background: #f2f0ff; }

    th {
      font-family: 'DM Sans', sans-serif;
      font-weight: 600;
      font-size: 9.5pt;
      color: #0d0c1a;
      text-align: left;
      padding: 8pt 12pt;
      border: 1px solid #e4e1f5;
    }

    td {
      padding: 7pt 12pt;
      border: 1px solid #e8e6f0;
      color: #2d2b3e;
      vertical-align: top;
    }

    tr:nth-child(even) td { background: #faf9ff; }

  </style>
</head>
<body>
  <div class="doc-content">
    ${contentHtml}
  </div>

</body>
</html>`
  return { html, headerTemplate }
}

module.exports = { buildTemplate }
