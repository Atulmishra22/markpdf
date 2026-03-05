'use strict'
const { marked }     = require('marked')
const sanitizeHtml   = require('sanitize-html')

marked.use({ gfm: true, breaks: false })

// Allow all standard markdown-output tags.
// Block script, style, iframe, object, and dangerous attributes.
const SANITIZE_OPTIONS = {
  allowedTags: [
    'h1','h2','h3','h4','h5','h6',
    'p','br','hr',
    'strong','em','del','s',
    'code','pre','kbd','samp',
    'ul','ol','li',
    'blockquote',
    'table','thead','tbody','tfoot','tr','th','td',
    'a','img',
    'div','span',
    'sup','sub',
  ],
  allowedAttributes: {
    'a':   ['href', 'title', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'td':  ['align'],
    'th':  ['align'],
    '*':   ['class', 'id'],
  },
  // Prevent SSRF — no file:// or data: URIs allowed
  allowedSchemes: ['https', 'http', 'mailto'],
  allowedSchemesByTag: {
    img: ['https', 'http'],
    a:   ['https', 'http', 'mailto'],
  },
  allowProtocolRelative: false,
}

/**
 * Parses a Markdown string into sanitized HTML.
 * Throws TypeError if input is not a string.
 */
function parseMarkdown(md) {
  if (typeof md !== 'string') throw new TypeError('markdown must be a string')
  const raw = marked.parse(md)
  return sanitizeHtml(raw, SANITIZE_OPTIONS)
}

module.exports = { parseMarkdown }
