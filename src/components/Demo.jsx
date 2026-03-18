import { useState, useEffect, useActionState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import styles from './Demo.module.css'

const API = (import.meta.env.VITE_API_BASE || 'http://localhost:3001/api').replace(/\/$/, '')

const DEFAULT_MARKDOWN = `# API Reference

## Authentication

All requests must include an **Authorization** header with your API key.

\`\`\`bash
curl -H "Authorization: Bearer YOUR_KEY" \\
  https://api.mark2pdf.dev/convert
\`\`\`

## Convert Endpoint

Send a \`POST\` request with your content:

- Supports full CommonMark spec
- Tables, code blocks, math
- Custom CSS templates
- Returns binary PDF stream

## Response Codes

| Code | Meaning |
| ---- | ------- |
| 200  | Success |
| 400  | Invalid input |
| 429  | Rate limited |
`

const DEFAULT_TEX = `\\section{API Reference}

\\subsection{Authentication}
All requests must include a \\textbf{Bearer token}.

\\subsection{Convert Endpoint}
Send a POST request with your TeX content:

\\begin{itemize}
  \\item Supports core sectioning commands
  \\item Supports itemize and enumerate lists
  \\item Preserves inline math like $E=mc^2$
\\end{itemize}

\\subsection{Response}
The API returns a binary PDF stream.
`

export default function Demo() {
  const [format, setFormat] = useState('markdown')
  const [source, setSource] = useState(DEFAULT_MARKDOWN)
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewError, setPreviewError] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const titleRef  = useScrollReveal()
  const widgetRef = useScrollReveal()

  const handleChange = (e) => setSource(e.target.value)

  const handleFormatChange = (nextFormat) => {
    setFormat(nextFormat)
    setSource(nextFormat === 'tex' ? DEFAULT_TEX : DEFAULT_MARKDOWN)
  }

  const [error, handleDownload, loading] = useActionState(async () => {
    try {
      const res = await fetch(`${API}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          content: source,
          options: { title: format === 'tex' ? 'document-tex' : 'document' },
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        return body.error || (res.status >= 500
          ? 'Backend unavailable. Start backend server on port 3001.'
          : `Server error ${res.status}`)
      }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = Object.assign(document.createElement('a'), {
        href: url,
        download: format === 'tex' ? 'document-tex.pdf' : 'document.pdf',
      })
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return null
    } catch (e) {
      return 'Cannot reach backend. Start backend server on port 3001.'
    }
  }, null)

  useEffect(() => {
    if (!source.trim()) {
      setPreviewHtml('<p>Start typing to preview your PDF.</p>')
      setPreviewError(null)
      setPreviewLoading(false)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setPreviewLoading(true)
      try {
        const res = await fetch(`${API}/preview`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ format, content: source }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          setPreviewError(body.error || (res.status >= 500
            ? 'Backend unavailable. Start backend server on port 3001.'
            : `Preview error ${res.status}`))
          return
        }

        const body = await res.json()
        setPreviewHtml(typeof body.html === 'string' ? body.html : '')
        setPreviewError(null)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setPreviewError('Cannot reach backend. Start backend server on port 3001.')
        }
      } finally {
        setPreviewLoading(false)
      }
    }, 220)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [format, source])

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
            Choose your input mode and download a clean, beautifully typeset PDF.
          </p>
        </div>

        <div className={styles.modeSwitch} role="tablist" aria-label="Input format">
          <button
            type="button"
            role="tab"
            aria-selected={format === 'markdown'}
            className={`${styles.modeBtn} ${format === 'markdown' ? styles.activeMode : ''}`}
            onClick={() => handleFormatChange('markdown')}
          >
            Markdown
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={format === 'tex'}
            className={`${styles.modeBtn} ${format === 'tex' ? styles.activeMode : ''}`}
            onClick={() => handleFormatChange('tex')}
          >
            TeX
          </button>
        </div>

        <div ref={widgetRef} className={`reveal ${styles.widget}`}>
          {/* Input pane */}
          <div className={styles.pane}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>{format === 'tex' ? 'input.tex' : 'input.md'}</span>
              <div className={styles.trafficLights} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            </div>
            <textarea
              className={styles.editor}
              value={source}
              onChange={handleChange}
              spellCheck={false}
              aria-label={format === 'tex' ? 'TeX input editor' : 'Markdown input editor'}
            />
          </div>

          {/* Output pane */}
          <div className={styles.pane}>
            <div className={styles.paneHeader}>
              <span className={styles.paneLabel}>output.pdf</span>
              <span className={styles.badge}>{previewLoading ? 'RENDERING' : 'LIVE'}</span>
            </div>
            <div className={styles.pdfWrapper}>
              <div
                className={styles.pdfPage}
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
            {/* Download bar */}
            <div className={styles.downloadBar}>
              {previewError && <span className={styles.errorMsg}>⚠ {previewError}</span>}
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
