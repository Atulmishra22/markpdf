# MarkPDF

Convert Markdown to beautifully typeset PDFs instantly — zero configuration required.

## Overview

MarkPDF is a full-stack application with a React landing page and a Node.js/Express API that converts Markdown to PDF using Puppeteer (headless Chrome). It is 100% CommonMark spec-compliant and supports tables, footnotes, math, and code blocks.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, CSS Modules |
| Backend | Node.js, Express 5 |
| PDF Engine | Puppeteer 24 (headless Chrome) |
| Markdown Parser | Marked 17 |
| Security | Helmet, express-rate-limit, sanitize-html |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
# Install frontend dependencies
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
