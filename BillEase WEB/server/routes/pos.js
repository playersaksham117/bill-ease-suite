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

// Products
router.get('/products', (req, res) => {
  try {
    const products = req.db.prepare('SELECT * FROM pos_products ORDER BY created_at DESC').all()
    res.json(products || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/products', (req, res) => {
  try {
    const { name, price, stock, category, sku, barcode, description } = req.body
    const result = req.db.prepare(`
      INSERT INTO pos_products (name, price, stock, category, sku, barcode, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name, price, stock, category, sku, barcode, description)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/products/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, price, stock, category, sku, barcode, description } = req.body
    req.db.prepare(`
      UPDATE pos_products
      SET name = ?, price = ?, stock = ?, category = ?, sku = ?, barcode = ?, description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, price, stock, category, sku, barcode, description, id)
    res.json({ id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM pos_products WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Entities (Customers/Suppliers)
router.get('/entities', (req, res) => {
  try {
    const { type } = req.query
    let query = 'SELECT * FROM pos_entities'
    if (type) {
      query += ' WHERE type = ?'
      const entities = req.db.prepare(query + ' ORDER BY created_at DESC').all(type)
      return res.json(entities || [])
    }
    const entities = req.db.prepare(query + ' ORDER BY created_at DESC').all()
    res.json(entities || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/entities', (req, res) => {
  try {
    const { name, type, address, city, state, pincode, gstin, contact, email } = req.body
    const result = req.db.prepare(`
      INSERT INTO pos_entities (name, type, address, city, state, pincode, gstin, contact, email)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, type, address, city, state, pincode, gstin, contact, email)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/entities/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, type, address, city, state, pincode, gstin, contact, email } = req.body
    req.db.prepare(`
      UPDATE pos_entities
      SET name = ?, type = ?, address = ?, city = ?, state = ?, pincode = ?, gstin = ?, contact = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, type, address, city, state, pincode, gstin, contact, email, id)
    res.json({ id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/entities/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM pos_entities WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Sales
router.get('/sales', (req, res) => {
  try {
    const sales = req.db.prepare(`
      SELECT s.*, e.name as entity_name
      FROM pos_sales s
      LEFT JOIN pos_entities e ON s.entity_id = e.id
      ORDER BY s.date DESC, s.created_at DESC
    `).all()
    
    // Get items for each sale
    const salesWithItems = (sales || []).map(sale => {
      const items = req.db.prepare('SELECT * FROM pos_sale_items WHERE sale_id = ?').all(sale.id)
      return { ...sale, items: items || [] }
    })
    
    res.json(salesWithItems || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/sales', (req, res) => {
  try {
    const { invoice_no, date, entity_id, entity_type, invoice_type, total, paid, balance, items } = req.body
    
    const saleResult = req.db.prepare(`
      INSERT INTO pos_sales (invoice_no, date, entity_id, entity_type, invoice_type, total, paid, balance)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(invoice_no, date, entity_id, entity_type, invoice_type, total, paid, balance)
    
    const saleId = saleResult.lastInsertRowid
    
    // Insert items
    const insertItem = req.db.prepare(`
      INSERT INTO pos_sale_items (sale_id, product_id, product_name, quantity, price, discount, tax, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    items.forEach(item => {
      insertItem.run(saleId, item.product_id, item.product_name, item.quantity, item.price, item.discount, item.tax, item.total)
    })
    
    res.json({ id: saleId, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Payments
router.get('/payments', (req, res) => {
  try {
    const payments = req.db.prepare(`
      SELECT p.*, e.name as entity_name
      FROM pos_payments p
      LEFT JOIN pos_entities e ON p.entity_id = e.id
      ORDER BY p.date DESC, p.created_at DESC
    `).all()
    res.json(payments || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/payments', (req, res) => {
  try {
    const { receipt_no, date, entity_id, entity_type, amount, payment_mode, reference, notes } = req.body
    const result = req.db.prepare(`
      INSERT INTO pos_payments (receipt_no, date, entity_id, entity_type, amount, payment_mode, reference, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(receipt_no, date, entity_id, entity_type, amount, payment_mode, reference, notes)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Quotations
router.get('/quotations', (req, res) => {
  try {
    const quotations = req.db.prepare(`
      SELECT q.*, e.name as entity_name
      FROM pos_quotations q
      LEFT JOIN pos_entities e ON q.entity_id = e.id
      ORDER BY q.date DESC, q.created_at DESC
    `).all()
    
    const quotationsWithItems = (quotations || []).map(quote => {
      const items = req.db.prepare('SELECT * FROM pos_quotation_items WHERE quotation_id = ?').all(quote.id)
      return { ...quote, items: items || [] }
    })
    
    res.json(quotationsWithItems || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/quotations', (req, res) => {
  try {
    const { quote_no, date, entity_id, entity_type, valid_until, total, status, items } = req.body
    
    const quoteResult = req.db.prepare(`
      INSERT INTO pos_quotations (quote_no, date, entity_id, entity_type, valid_until, total, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(quote_no, date, entity_id, entity_type, valid_until, total, status)
    
    const quoteId = quoteResult.lastInsertRowid
    
    const insertItem = req.db.prepare(`
      INSERT INTO pos_quotation_items (quotation_id, product_id, product_name, quantity, price, discount, tax, total)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    items.forEach(item => {
      insertItem.run(quoteId, item.product_id, item.product_name, item.quantity, item.price, item.discount, item.tax, item.total)
    })
    
    res.json({ id: quoteId, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

