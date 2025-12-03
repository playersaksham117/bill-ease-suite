import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import { initDb } from './database-simple.js'
import inventoRoutes from './routes/invento.js'
import incomeExpenseRoutes from './routes/incomeExpense.js'
import posRoutes from './routes/pos.js'
import accountsPlusRoutes from './routes/accountsPlus.js'
import crmRoutes from './routes/crm.js'

const app = express()
const PORT = process.env.PORT || 3001

// Performance optimizations
// Enable gzip compression for all responses
app.use(compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  }
}))

// CORS with optimized settings
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  maxAge: 86400 // Cache preflight requests for 24 hours
}))

// Body parser with size limits
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`)
    })
    next()
  })
}

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database (creates tables if they don't exist)
    await initDb()
    console.log('Database initialized')

    // Routes
    app.use('/api/invento', inventoRoutes)
    app.use('/api/income-expense', incomeExpenseRoutes)
    app.use('/api/pos', posRoutes)
    app.use('/api/accounts-plus', accountsPlusRoutes)
    app.use('/api/crm', crmRoutes)

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        message: 'BillEase Suite API is running'
      })
    })

    // 404 handler for API routes - must be after all routes
    app.use('/api/*', (req, res) => {
      console.log(`404: API endpoint not found: ${req.method} ${req.path}`)
      res.status(404).json({ error: 'API endpoint not found', path: req.path, method: req.method })
    })

    // General 404 handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found', path: req.path })
    })

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()


