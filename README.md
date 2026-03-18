# MarkPDF

Convert Markdown to beautifully typeset PDFs instantly — zero configuration required.

## Overview

Convert Markdown and TeX to beautifully typeset PDFs instantly — zero configuration required.

## Tech Stack

It is CommonMark-compliant for Markdown and also supports lightweight TeX-to-PDF conversion without installing a TeX distribution.
|---|---|
Converts Markdown or TeX to a PDF file.
| Backend | Node.js, Express 5 |
| PDF Engine | Puppeteer 24 (headless Chrome) |
| Markdown Parser | Marked 17 |
| Security | Helmet, express-rate-limit, sanitize-html |

  "format": "markdown",
  "content": "# Hello World\n\nYour content here.",

### Prerequisites

- Node.js 18+
- npm

Legacy markdown payloads are still supported:

```json
{
  "markdown": "# Hello World"
}
```

### Install

| `format` | string | No | `markdown` (default) or `tex` |
| `content` | string | Preferred | Non-empty, max 512 KB |
| `markdown` / `tex` | string | Optional | Backward-compat fields matched by `format` |
# Install frontend dependencies

TeX mode intentionally supports a practical subset (`section`, `subsection`, `itemize`, `enumerate`, inline formatting, and math blocks) and does not require `pdflatex` or external system binaries.
npm install

# Install backend dependencies
cd backend && npm install
```

### Run in Development

```bash
# Start the frontend (http://localhost:5173)
npm run dev

# In a separate terminal, start the backend (http://localhost:3001)
cd backend && npm run dev
```

### Build for Production

```bash
npm run build       # Build frontend
npm run preview     # Preview production build (http://localhost:4173)
```

## API Reference

### `POST /api/convert`

Converts Markdown to a PDF file.

**Request body:**

```json
{
  "markdown": "# Hello World\n\nYour markdown content here.",
  "options": {
    "title": "My Document"
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `markdown` | string | Yes | Non-empty, max 512 KB |
| `options.title` | string | No | Max 200 characters |

**Response:** `application/pdf` file download.

**Rate limit:** 30 requests per minute per IP.

**Error responses:**

| Status | Reason |
|---|---|
| `400` | Missing or invalid `markdown` field |
| `413` | Markdown exceeds 512 KB |
| `500` | PDF generation failed |

### `GET /health`

Returns `{ "status": "ok" }` — use for uptime checks.

## Project Structure

```
├── src/                  # React frontend
│   ├── components/       # UI components (Hero, Features, Demo, …)
│   └── hooks/            # Scroll animation hooks
├── backend/
│   ├── server.js         # Express app entry point
│   ├── routes/convert.js # /api/convert route handler
│   └── lib/              # Markdown, PDF, and template helpers
├── index.html
└── vite.config.js
```

## License

MIT
