import express from 'express'
import { getDb } from '../database-simple.js'

const router = express.Router()

// Middleware to attach database to request
let db
getDb().then(database => {
  db = database
})

router.use(async (req, res, next) => {
  if (!db) {
    db = await getDb()
  }
  req.db = db
  next()
})

// Transactions
router.get('/transactions', (req, res) => {
  try {
    const { type } = req.query
    let query = 'SELECT * FROM transactions'
    if (type) {
      query += ' WHERE type = ?'
      const transactions = req.db.prepare(query + ' ORDER BY date DESC, created_at DESC').all(type)
      return res.json(transactions || [])
    }
    const transactions = req.db.prepare(query + ' ORDER BY date DESC, created_at DESC').all()
    res.json(transactions || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.get('/transactions/:id', (req, res) => {
  try {
    const { id } = req.params
    const transaction = req.db.prepare('SELECT * FROM transactions WHERE id = ?').get(id)
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }
    res.json(transaction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/transactions', (req, res) => {
  try {
    const { type, description, amount, date, category, notes, mode, member_id, payment_method, tags } = req.body
    
    // Validate required fields
    if (!type || !description || amount === undefined || !date || !category) {
      return res.status(400).json({ error: 'Missing required fields: type, description, amount, date, category' })
    }
    
    // Validate amount
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' })
    }
    
    const result = req.db.prepare(`
      INSERT INTO transactions (type, description, amount, date, category, notes, mode, member_id, payment_method, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(type, description.trim(), amountNum, date, category, notes || '', mode || 'individual', member_id || null, payment_method || 'cash', tags ? JSON.stringify(tags) : null)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    // If table doesn't exist yet, try to initialize
    if (error.message && error.message.includes('no such table')) {
      return res.status(503).json({ error: 'Database not initialized. Please restart the server.' })
    }
    res.status(500).json({ error: error.message })
  }
})

router.put('/transactions/:id', (req, res) => {
  try {
    const { id } = req.params
    const { type, description, amount, date, category, notes, mode, member_id, payment_method, tags } = req.body
    req.db.prepare(`
      UPDATE transactions
      SET type = ?, description = ?, amount = ?, date = ?, category = ?, notes = ?, mode = ?, member_id = ?, payment_method = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(type, description, amount, date, category, notes || '', mode || 'individual', member_id || null, payment_method || 'cash', tags ? JSON.stringify(tags) : null, id)
    res.json({ id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/transactions/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM transactions WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Income Categories
router.get('/categories/income', (req, res) => {
  try {
    const categories = req.db.prepare('SELECT * FROM income_categories ORDER BY name').all()
    res.json((categories || []).map(c => c.name))
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/categories/income', (req, res) => {
  try {
    const { name } = req.body
    const result = req.db.prepare('INSERT INTO income_categories (name) VALUES (?)').run(name)
    res.json({ id: result.lastInsertRowid, name })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/categories/income/:name', (req, res) => {
  try {
    const { name } = req.params
    req.db.prepare('DELETE FROM income_categories WHERE name = ?').run(name)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Expense Categories
router.get('/categories/expense', (req, res) => {
  try {
    const categories = req.db.prepare('SELECT * FROM expense_categories ORDER BY name').all()
    res.json((categories || []).map(c => c.name))
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/categories/expense', (req, res) => {
  try {
    const { name } = req.body
    const result = req.db.prepare('INSERT INTO expense_categories (name) VALUES (?)').run(name)
    res.json({ id: result.lastInsertRowid, name })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/categories/expense/:name', (req, res) => {
  try {
    const { name } = req.params
    req.db.prepare('DELETE FROM expense_categories WHERE name = ?').run(name)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Budgets
router.get('/budgets', (req, res) => {
  try {
    const { mode } = req.query
    let query = 'SELECT * FROM budgets'
    if (mode) {
      query += ' WHERE mode = ?'
      const budgets = req.db.prepare(query).all(mode)
      return res.json(budgets || [])
    }
    const budgets = req.db.prepare(query).all()
    res.json(budgets || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/budgets', (req, res) => {
  try {
    const { category, amount, period, mode } = req.body
    const result = req.db.prepare('INSERT INTO budgets (category, amount, period, mode) VALUES (?, ?, ?, ?)').run(category, amount, period, mode || 'individual')
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Recurring Transactions
router.get('/recurring', (req, res) => {
  try {
    const { mode } = req.query
    let query = 'SELECT * FROM recurring_transactions'
    if (mode) {
      query += ' WHERE mode = ?'
      const recurring = req.db.prepare(query).all(mode)
      return res.json(recurring || [])
    }
    const recurring = req.db.prepare(query).all()
    res.json(recurring || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/recurring', (req, res) => {
  try {
    const { type, description, amount, category, frequency, start_date, end_date, notes, mode } = req.body
    const result = req.db.prepare(`
      INSERT INTO recurring_transactions (type, description, amount, category, frequency, start_date, end_date, notes, mode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(type, description, amount, category, frequency, start_date, end_date || null, notes || '', mode || 'individual')
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Family Members
router.get('/family-members', (req, res) => {
  try {
    const members = req.db.prepare('SELECT * FROM family_members ORDER BY name').all()
    res.json(members || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/family-members', (req, res) => {
  try {
    const { name, email, role } = req.body
    const result = req.db.prepare('INSERT INTO family_members (name, email, role) VALUES (?, ?, ?)').run(name, email || '', role || 'member')
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Summary/Stats
router.get('/summary', (req, res) => {
  try {
    const totalIncome = req.db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = ?').get('income')
    const totalExpense = req.db.prepare('SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = ?').get('expense')
    const balance = (totalIncome?.total || 0) - (totalExpense?.total || 0)
    
    res.json({
      totalIncome: totalIncome?.total || 0,
      totalExpense: totalExpense?.total || 0,
      balance
    })
  } catch (error) {
    // If table doesn't exist yet, return zeros
    if (error.message && error.message.includes('no such table')) {
      return res.json({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      })
    }
    res.status(500).json({ error: error.message })
  }
})

export default router

