'use strict'
const sanitizeHtml = require('sanitize-html')

const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4',
    'p', 'br', 'hr',
    'strong', 'em', 'u',
    'sup', 'sub',
    'code', 'pre',
    'ul', 'ol', 'li',
    'blockquote',
    'a',
    'div', 'span',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'rel'],
    '*': ['class'],
  },
  allowedSchemes: ['https', 'http', 'mailto'],
  allowedSchemesByTag: {
    a: ['https', 'http', 'mailto'],
  },
  allowProtocolRelative: false,
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function stripComments(tex) {
  return tex
    .split('\n')
    .map((line) => line.replace(/(^|[^\\])%.*/, '$1'))
    .join('\n')
}

function extractDocumentBody(tex) {
  const match = tex.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/)
  return match ? match[1] : tex
}

function findBalancedBraceEnd(input, openIdx) {
  let depth = 0
  for (let i = openIdx; i < input.length; i++) {
    const ch = input[i]
    if (ch === '{') depth += 1
    if (ch === '}') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return -1
}

function readBracedArg(input, startIdx) {
  let i = startIdx
  while (i < input.length && /\s/.test(input[i])) i += 1
  if (input[i] !== '{') return null
  const end = findBalancedBraceEnd(input, i)
  if (end === -1) return null
  return {
    value: input.slice(i + 1, end),
    next: end + 1,
  }
}

function replaceCommandWithArgs(input, commandName, argCount, replacer) {
  const needle = `\\${commandName}`
  let out = ''
  let i = 0

  while (i < input.length) {
    const idx = input.indexOf(needle, i)
    if (idx === -1) {
      out += input.slice(i)
      break
    }

    out += input.slice(i, idx)
    let cursor = idx + needle.length
    const args = []
    let ok = true

    for (let n = 0; n < argCount; n++) {
      const parsed = readBracedArg(input, cursor)
      if (!parsed) {
        ok = false
        break
      }
      args.push(parsed.value)
      cursor = parsed.next
    }

    if (!ok) {
      out += input.slice(idx, idx + needle.length)
      i = idx + needle.length
      continue
    }

    out += replacer(args)
    i = cursor
  }

  return out
}

function preprocessTex(input) {
  let out = input
  out = out
    .replace(/\\vspace\{[^{}]*\}/g, '\n')
    .replace(/\\noindent\b/g, '')
    .replace(/\\hfill\b/g, ' ')
    .replace(/\\enspace\b/g, ' ')
    .replace(/\\textbar\{\}/g, '|')
    .replace(/\\textbar\b/g, '|')

  out = replaceCommandWithArgs(out, 'entryhead', 3, ([role, date, meta]) => {
    const metaHtml = meta.trim()
      ? `<div class="tex-entry-sub">${inlineTex(meta)}</div>`
      : ''

    return `
<div class="tex-entry-head">
  <span class="tex-entry-left">${inlineTex(role)}</span>
  <span class="tex-entry-right">${inlineTex(date)}</span>
</div>
${metaHtml}`
  })

  out = replaceCommandWithArgs(out, 'projecthead', 3, ([title, stack, date]) => {
    return `
<div class="tex-entry-head">
  <span class="tex-entry-left">${inlineTex(title)}</span>
  <span class="tex-entry-right">${inlineTex(date)}</span>
</div>
<div class="tex-entry-sub">${inlineTex(stack)}</div>`
  })

  return out
}

function renderMathExpression(input) {
  let out = escapeHtml(input.trim())

  // Support common TeX-style exponent/subscript forms for readable output.
  out = out
    .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    .replace(/\^([A-Za-z0-9])/g, '<sup>$1</sup>')
    .replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
    .replace(/_([A-Za-z0-9])/g, '<sub>$1</sub>')

  return out
}

function normalizeInlineTexSource(input) {
  let out = input

  // Convert TeX line breaks with optional spacing to a standard line break token.
  out = out.replace(/\\\\\s*\[[^\]]*\]/g, '\\\\')

  // Drop declaration-style font/shape commands while keeping their grouped text.
  out = out.replace(/\\(?:tiny|scriptsize|footnotesize|small|normalsize|large|Large|LARGE|huge|Huge)\b/g, '')
  out = out.replace(/\\(?:bfseries|mdseries|itshape|slshape|upshape|rmfamily|sffamily|ttfamily)\b/g, '')

  // Decode common escaped literal characters.
  out = out
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')

  // Clean up extra spaces introduced by stripping style declarations.
  out = out.replace(/[ \t]{2,}/g, ' ')

  return out
}

function inlineTex(input) {
  let out = escapeHtml(normalizeInlineTexSource(input))

  out = out
    .replace(/\\textbf\{([^{}]*)\}/g, '<strong>$1</strong>')
    .replace(/\\textit\{([^{}]*)\}/g, '<em>$1</em>')
    .replace(/\\emph\{([^{}]*)\}/g, '<em>$1</em>')
    .replace(/\\underline\{([^{}]*)\}/g, '<u>$1</u>')

  out = out
    .replace(/\\href\{([^{}]+)\}\{([^{}]*)\}/g, '<a href="$1" rel="noopener noreferrer">$2</a>')
    .replace(/\\url\{([^{}]+)\}/g, '<a href="$1" rel="noopener noreferrer">$1</a>')

  // Drop any remaining style-scoping braces after known command rewrites.
  out = out.replace(/[{}]/g, '')

  out = out
    .replace(/\\\(([^]*?)\\\)/g, (_m, body) => `<span class="tex-math-inline">${renderMathExpression(body)}</span>`)
    .replace(/\$(?!\$)([^\n$]+?)\$/g, (_m, body) => `<span class="tex-math-inline">${renderMathExpression(body)}</span>`)

  out = out
    .replace(/\\\\/g, '<br/>')
    .replace(/\\newline\b/g, '<br/>')

  return out
}

function convertListEnvironment(tex, envName, tagName) {
  const envPattern = new RegExp(`\\\\begin\\{${envName}\\}([\\s\\S]*?)\\\\end\\{${envName}\\}`, 'g')
  return tex.replace(envPattern, (_m, body) => {
    const parts = body.split(/\\item\s*/).map((part) => part.trim()).filter(Boolean)
    if (!parts.length) return ''
    const items = parts.map((part) => `<li>${inlineTex(part)}</li>`).join('')
    return `<${tagName}>${items}</${tagName}>`
  })
}

function parseTex(tex) {
  if (typeof tex !== 'string') throw new TypeError('tex must be a string')

  let src = tex.replace(/\r\n?/g, '\n')
  src = stripComments(src)
  src = extractDocumentBody(src).trim()
  src = preprocessTex(src)

  src = src.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, (_m, body) => {
    const rendered = inlineTex(body.trim()).replace(/\n+/g, ' ')
    return `<div class="tex-center">${rendered}</div>`
  })

  src = src.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, (_m, body) => {
    return `<pre><code>${escapeHtml(body.trim())}</code></pre>`
  })

  src = src.replace(/\\\[([\s\S]*?)\\\]/g, (_m, body) => {
    return `<div class="tex-math-display">${renderMathExpression(body)}</div>`
  })

  src = src.replace(/\$\$([\s\S]*?)\$\$/g, (_m, body) => {
    return `<div class="tex-math-display">${renderMathExpression(body)}</div>`
  })

  src = convertListEnvironment(src, 'itemize', 'ul')
  src = convertListEnvironment(src, 'enumerate', 'ol')

  src = src
    .replace(/\\section\{([^{}]+)\}/g, '<h1>$1</h1>')
    .replace(/\\subsection\{([^{}]+)\}/g, '<h2>$1</h2>')
    .replace(/\\subsubsection\{([^{}]+)\}/g, '<h3>$1</h3>')
    .replace(/\\paragraph\{([^{}]+)\}/g, '<h4>$1</h4>')

  // Ensure heading tags become standalone blocks so following text still runs through inlineTex.
  src = src.replace(/<(h[1-4])>([\s\S]*?)<\/\1>/g, '\n\n<$1>$2</$1>\n\n')

  const blocks = src.split(/\n\s*\n/)
  const html = blocks.map((block) => {
    const trimmed = block.trim()
    if (!trimmed) return ''
    if (/^<(h1|h2|h3|h4|ul|ol|pre|div)\b/.test(trimmed)) return trimmed
    return `<p>${inlineTex(trimmed)}</p>`
  }).join('\n')

  return sanitizeHtml(html, SANITIZE_OPTIONS)
}

module.exports = { parseTex }
