import express from 'express'
import { getDb } from '../database-simple.js'

const router = express.Router()

// Initialize tables if they don't exist - make it async
const initTables = async () => {
  const database = await getDb()
  // Warehouses table
  database.exec(`
    CREATE TABLE IF NOT EXISTS warehouses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      capacity INTEGER DEFAULT 0,
      manager TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Items table
  database.exec(`
    CREATE TABLE IF NOT EXISTS invento_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT,
      quantity INTEGER DEFAULT 0,
      unit TEXT DEFAULT 'pcs',
      location TEXT,
      min_stock INTEGER DEFAULT 0,
      cost REAL DEFAULT 0,
      category TEXT,
      description TEXT,
      hsn_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Add hsn_code column if it doesn't exist (for existing databases)
  try {
    database.exec(`ALTER TABLE invento_items ADD COLUMN hsn_code TEXT`)
  } catch (e) {
    // Column already exists, ignore error
  }

  // Transactions table
  database.exec(`
    CREATE TABLE IF NOT EXISTS invento_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('in', 'out')),
      quantity INTEGER NOT NULL,
      date TEXT NOT NULL,
      location TEXT,
      notes TEXT,
      reference TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES invento_items(id)
    )
  `)
}

// Initialize tables on module load
let db
getDb().then(database => {
  db = database
  initTables()
})

// Middleware to attach database to request
router.use(async (req, res, next) => {
  if (!db) {
    db = await getDb()
    await initTables()
  }
  req.db = db
  next()
})

// Warehouses routes
router.get('/warehouses', (req, res) => {
  try {
    const warehouses = req.db.prepare('SELECT * FROM warehouses ORDER BY name').all()
    res.json(warehouses || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/warehouses', (req, res) => {
  try {
    const { name, address, city, state, pincode, capacity, manager, phone } = req.body
    
    if (!name) {
      return res.status(400).json({ error: 'Warehouse name is required' })
    }

    const result = req.db.prepare(`
      INSERT INTO warehouses (name, address, city, state, pincode, capacity, manager, phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, address || null, city || null, state || null, pincode || null, capacity || 0, manager || null, phone || null)

    const warehouse = req.db.prepare('SELECT * FROM warehouses WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(warehouse)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/warehouses/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM warehouses WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Items routes
router.get('/items', (req, res) => {
  try {
    const items = req.db.prepare('SELECT * FROM invento_items ORDER BY name').all()
    res.json(items || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.get('/items/:id', (req, res) => {
  try {
    const { id } = req.params
    const item = req.db.prepare('SELECT * FROM invento_items WHERE id = ?').get(id)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/items', (req, res) => {
  try {
    const { name, sku, quantity, unit, location, min_stock, cost, category, description, hsn_code } = req.body
    
    if (!name) {
      return res.status(400).json({ error: 'Item name is required' })
    }

    const result = req.db.prepare(`
      INSERT INTO invento_items (name, sku, quantity, unit, location, min_stock, cost, category, description, hsn_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      sku || null,
      quantity || 0,
      unit || 'pcs',
      location || null,
      min_stock || 0,
      cost || 0,
      category || null,
      description || null,
      hsn_code || null
    )

    const item = req.db.prepare('SELECT * FROM invento_items WHERE id = ?').get(result.lastInsertRowid)
    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/items/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, sku, quantity, unit, location, min_stock, cost, category, description, hsn_code } = req.body

    req.db.prepare(`
      UPDATE invento_items
      SET name = ?, sku = ?, quantity = ?, unit = ?, location = ?, min_stock = ?, cost = ?, category = ?, description = ?, hsn_code = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name,
      sku || null,
      quantity || 0,
      unit || 'pcs',
      location || null,
      min_stock || 0,
      cost || 0,
      category || null,
      description || null,
      hsn_code || null,
      id
    )

    const item = req.db.prepare('SELECT * FROM invento_items WHERE id = ?').get(id)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/items/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM invento_items WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Transactions routes
router.get('/transactions', (req, res) => {
  try {
    const { type } = req.query
    let query = 'SELECT * FROM invento_transactions ORDER BY date DESC, created_at DESC'
    let transactions

    if (type) {
      transactions = req.db.prepare('SELECT * FROM invento_transactions WHERE type = ? ORDER BY date DESC, created_at DESC').all(type)
    } else {
      transactions = req.db.prepare(query).all()
    }

    res.json(transactions || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/transactions', (req, res) => {
  try {
    const { item_id, type, quantity, date, location, notes, reference } = req.body
    
    if (!item_id || !type || !quantity || !date) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (type !== 'in' && type !== 'out') {
      return res.status(400).json({ error: 'Type must be "in" or "out"' })
    }

    // Get current item quantity
    const item = req.db.prepare('SELECT * FROM invento_items WHERE id = ?').get(item_id)
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    // Calculate new quantity
    let newQuantity = item.quantity || 0
    if (type === 'in') {
      newQuantity += parseInt(quantity)
    } else {
      newQuantity -= parseInt(quantity)
      if (newQuantity < 0) {
        return res.status(400).json({ error: 'Insufficient stock' })
      }
    }

    // Create transaction
    const transactionResult = req.db.prepare(`
      INSERT INTO invento_transactions (item_id, type, quantity, date, location, notes, reference)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(item_id, type, quantity, date, location || null, notes || null, reference || null)

    // Update item quantity
    req.db.prepare('UPDATE invento_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newQuantity, item_id)

    const transaction = req.db.prepare('SELECT * FROM invento_transactions WHERE id = ?').get(transactionResult.lastInsertRowid)
    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Alerts route
router.get('/alerts', (req, res) => {
  try {
    const items = req.db.prepare(`
      SELECT * FROM invento_items 
      WHERE quantity <= min_stock 
      ORDER BY (quantity - min_stock) ASC
    `).all()
    res.json(items || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

export default router

