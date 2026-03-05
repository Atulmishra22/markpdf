import { useState, useActionState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Demo.module.css'

const API = 'http://localhost:3001/api'

const DEFAULT_MARKDOWN = `# API Reference

## Authentication

All requests must include an **Authorization** header with your API key.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_KEY" \\
  https://api.markpdf.dev/convert
\`\`\`

## Convert Endpoint

Send a \`POST\` request with your *markdown content*:

- Supports full CommonMark spec
- Tables, code blocks, math
- Custom CSS templates
- Returns binary PDF stream

## Response Codes

| Code | Meaning |
| ---- | ------- |
| 200  | Success |
| 400  | Invalid markdown |
| 429  | Rate limited |
`

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineFormat(text) {
  const safe = escapeHtml(text)
  return safe
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function parseMarkdown(md) {
  const lines = md.split('\n')
  let html = ''
  let inFence = false
  let fenceBuffer = ''
  let inTable = false
  let tableRows = []

  const flushTable = () => {
    if (!tableRows.length) return
    let t = '<table>'
    tableRows.forEach((row, idx) => {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean)
      if (idx === 0) {
        t += '<thead><tr>' + cells.map(c => `<th>${inlineFormat(c)}</th>`).join('') + '</tr></thead><tbody>'
      } else if (idx === 1) {
        // skip separator row
      } else {
        t += '<tr>' + cells.map(c => `<td>${inlineFormat(c)}</td>`).join('') + '</tr>'
      }
    })
    t += '</tbody></table>'
    html += t
    tableRows = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Fenced code blocks
    if (line.startsWith('```')) {
      if (!inFence) {
        inFence = true
        fenceBuffer = ''
      } else {
        html += `<pre><code>${escapeHtml(fenceBuffer)}</code></pre>`
        inFence = false
        fenceBuffer = ''
      }
      continue
    }
    if (inFence) {
      fenceBuffer += line + '\n'
      continue
    }

    // Table rows
    if (line.trim().startsWith('|')) {
      inTable = true
      tableRows.push(line)
      continue
    } else if (inTable) {
      flushTable()
    }

    const trimmed = line.trim()

    if (!trimmed) {
      html += '<div class="spacer"></div>'
      continue
    }

    if (trimmed.startsWith('### ')) {
      html += `<h3>${inlineFormat(trimmed.slice(4))}</h3>`
    } else if (trimmed.startsWith('## ')) {
      html += `<h2>${inlineFormat(trimmed.slice(3))}</h2>`
    } else if (trimmed.startsWith('# ')) {
      html += `<h1>${inlineFormat(trimmed.slice(2))}</h1>`
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      html += `<li>${inlineFormat(trimmed.slice(2))}</li>`
    } else {
      html += `<p>${inlineFormat(trimmed)}</p>`
    }
  }

  if (inTable) flushTable()

  return html
}

export default function Demo() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const titleRef  = useScrollReveal()
  const widgetRef = useScrollReveal()

  const handleChange = (e) => setMarkdown(e.target.value)

  const [error, handleDownload, loading] = useActionState(async () => {
    try {
      const res = await fetch(`${API}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown, options: { title: 'document' } }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        return body.error || `Server error ${res.status}`
      }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = Object.assign(document.createElement('a'), {
        href: url, download: 'document.pdf',
      })
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return null
    } catch (e) {
      return e.message
    }
  }, null)

  const htmlOutput = parseMarkdown(markdown)

  return (
    <section id="demo" className={styles.section}>
      <div className="container">
        <div ref={titleRef} className={`reveal ${styles.header}`}>
          <span className="micro-label">// live preview</span>
          <h2 className={styles.title}>
            See the transformation.<br />
            <em>In real time.</em>
          </h2>
          <p className={styles.sub}>
            Type Markdown on the left. Download a real, beautifully typeset PDF on the right.
          </p>
        </div>

        <div ref={widgetRef} className={`reveal ${styles.widget}`}>
          {/* Input pane */}
          <div className={styles.pane}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>input.md</span>
              <div className={styles.trafficLights} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
            <textarea
              className={styles.editor}
              value={markdown}
              onChange={handleChange}
              spellCheck={false}
              aria-label="Markdown input editor"
            />
          </div>

          {/* Output pane */}
          <div className={styles.pane}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>output.pdf</span>
              <span className={styles.badge}>LIVE</span>
            </div>
            <div className={styles.pdfWrapper}>
              <div
                className={styles.pdfPage}
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
            {/* Download bar */}
            <div className={styles.downloadBar}>
              {error && <span className={styles.errorMsg}>⚠ {error}</span>}
              <button
                className={`${styles.downloadBtn} ${loading ? styles.loading : ''}`}
                onClick={handleDownload}
                disabled={loading}
                aria-live="polite"
                aria-label="Download PDF"
              >
                {loading ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    Rendering…
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                      <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2 13h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
