import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL

// GET entry to Google Sheet
app.get('/api/entry', async (req, res) => {
  if (!GOOGLE_SCRIPT_URL) {
    res.status(500).json({ error: 'GOOGLE_SCRIPT_URL not configured' })
    return
  }

  const { type, description, calories, date } = req.query

  if (!type || !description || !calories || !date) {
    res.status(400).json({ error: 'Missing fields: type, description, calories, date' })
    return
  }

  // if (!['Jedzenie', 'Aktywność'].includes(type as string)) {
  //   res.status(400).json({ error: 'type must be "Jedzenie" or "Aktywność"' })
  //   return
  // }

  try {
    const url = new URL(GOOGLE_SCRIPT_URL)
    url.searchParams.set('type', type as string)
    url.searchParams.set('description', description as string)
    url.searchParams.set('calories', String(Number(calories)))
    url.searchParams.set('date', date as string)
    url.searchParams.set('buster', 'ja-pierdole-kocham-paczki-69-!-123')

    const response = await fetch(url.toString(), { redirect: 'follow' })
    const text = await response.text()

    try {
      const result = JSON.parse(text)
      res.json({ success: true, result })
    } catch {
      res.json({ success: true, raw: text })
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to write to Google Sheet', detail: String(err) })
  }
})

// Home route - HTML
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>Express on Vercel</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/api-data">API Data</a>
          <a href="/healthz">Health</a>
        </nav>
        <h1>Welcome to Express on Vercel 🚀</h1>
        <p>This is a minimal example without a database or forms.</p>
        <img src="/logo.png" alt="Logo" width="120" />
      </body>
    </html>
  `)
})

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'))
})

// Example API endpoint - JSON
app.get('/api-data', (req, res) => {
  res.json({
    message: 'Here is some sample API data',
    items: ['apple', 'banana', 'cherry'],
  })
})

// Health check
app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
