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

// Companies
router.get('/companies', (req, res) => {
  try {
    const companies = req.db.prepare('SELECT * FROM companies ORDER BY created_at DESC').all()
    res.json(companies || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/companies', (req, res) => {
  try {
    const company = req.body
    const result = req.db.prepare(`
      INSERT INTO companies (name, address, city, state, pincode, phone, email, website, gstin, pan, business_type, opening_period, accounting_year)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      company.name, company.address, company.city, company.state, company.pincode,
      company.phone, company.email, company.website, company.gstin, company.pan,
      company.business_type, company.opening_period, company.accounting_year
    )
    res.json({ id: result.lastInsertRowid, ...company })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/companies/:id', (req, res) => {
  try {
    const { id } = req.params
    const company = req.body
    req.db.prepare(`
      UPDATE companies
      SET name = ?, address = ?, city = ?, state = ?, pincode = ?, phone = ?, email = ?, website = ?, gstin = ?, pan = ?, business_type = ?, opening_period = ?, accounting_year = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      company.name, company.address, company.city, company.state, company.pincode,
      company.phone, company.email, company.website, company.gstin, company.pan,
      company.business_type, company.opening_period, company.accounting_year, id
    )
    res.json({ id, ...company })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Ledgers
router.get('/ledgers', (req, res) => {
  try {
    const ledgers = req.db.prepare('SELECT * FROM ledgers ORDER BY created_at DESC').all()
    res.json(ledgers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/ledgers', (req, res) => {
  try {
    const { name, type, opening_balance, parent_group } = req.body
    const result = req.db.prepare(`
      INSERT INTO ledgers (name, type, opening_balance, parent_group)
      VALUES (?, ?, ?, ?)
    `).run(name, type, opening_balance, parent_group)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/ledgers/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, type, opening_balance, parent_group } = req.body
    req.db.prepare(`
      UPDATE ledgers
      SET name = ?, type = ?, opening_balance = ?, parent_group = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, type, opening_balance, parent_group, id)
    res.json({ id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/ledgers/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM ledgers WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Parties (Customers/Suppliers)
router.get('/parties', (req, res) => {
  try {
    const { type } = req.query
    let query = 'SELECT * FROM parties'
    if (type) {
      query += ' WHERE type = ?'
      const parties = req.db.prepare(query + ' ORDER BY created_at DESC').all(type)
      return res.json(parties)
    }
    const parties = req.db.prepare(query + ' ORDER BY created_at DESC').all()
    res.json(parties)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/parties', (req, res) => {
  try {
    const party = req.body
    const result = req.db.prepare(`
      INSERT INTO parties (name, type, address, city, state, pincode, contact, email, gstin, pan, credit_limit, opening_balance, classification)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      party.name, party.type, party.address, party.city, party.state, party.pincode,
      party.contact, party.email, party.gstin, party.pan, party.credit_limit,
      party.opening_balance, party.classification
    )
    res.json({ id: result.lastInsertRowid, ...party })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/parties/:id', (req, res) => {
  try {
    const { id } = req.params
    const party = req.body
    req.db.prepare(`
      UPDATE parties
      SET name = ?, type = ?, address = ?, city = ?, state = ?, pincode = ?, contact = ?, email = ?, gstin = ?, pan = ?, credit_limit = ?, opening_balance = ?, classification = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      party.name, party.type, party.address, party.city, party.state, party.pincode,
      party.contact, party.email, party.gstin, party.pan, party.credit_limit,
      party.opening_balance, party.classification, id
    )
    res.json({ id, ...party })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/parties/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM parties WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Items Master
router.get('/items', (req, res) => {
  try {
    const items = req.db.prepare('SELECT * FROM items_master ORDER BY created_at DESC').all()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/items', (req, res) => {
  try {
    const item = req.body
    const result = req.db.prepare(`
      INSERT INTO items_master (code, name, hsn, sac, uom, rate, cost_price, reorder_level, category, brand, group_name, opening_stock, opening_value)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      item.code, item.name, item.hsn, item.sac, item.uom, item.rate, item.cost_price,
      item.reorder_level, item.category, item.brand, item.group_name, item.opening_stock, item.opening_value
    )
    res.json({ id: result.lastInsertRowid, ...item })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/items/:id', (req, res) => {
  try {
    const { id } = req.params
    const item = req.body
    req.db.prepare(`
      UPDATE items_master
      SET code = ?, name = ?, hsn = ?, sac = ?, uom = ?, rate = ?, cost_price = ?, reorder_level = ?, category = ?, brand = ?, group_name = ?, opening_stock = ?, opening_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      item.code, item.name, item.hsn, item.sac, item.uom, item.rate, item.cost_price,
      item.reorder_level, item.category, item.brand, item.group_name, item.opening_stock, item.opening_value, id
    )
    res.json({ id, ...item })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/items/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM items_master WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Expense Heads
router.get('/expense-heads', (req, res) => {
  try {
    const heads = req.db.prepare('SELECT * FROM expense_heads ORDER BY created_at DESC').all()
    res.json(heads)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/expense-heads', (req, res) => {
  try {
    const { name, type, ledger, recurring } = req.body
    const result = req.db.prepare(`
      INSERT INTO expense_heads (name, type, ledger, recurring)
      VALUES (?, ?, ?, ?)
    `).run(name, type, ledger, recurring ? 1 : 0)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Income Heads
router.get('/income-heads', (req, res) => {
  try {
    const heads = req.db.prepare('SELECT * FROM income_heads ORDER BY created_at DESC').all()
    res.json(heads)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/income-heads', (req, res) => {
  try {
    const { name, type, ledger, recurring } = req.body
    const result = req.db.prepare(`
      INSERT INTO income_heads (name, type, ledger, recurring)
      VALUES (?, ?, ?, ?)
    `).run(name, type, ledger, recurring ? 1 : 0)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Employees
router.get('/employees', (req, res) => {
  try {
    const employees = req.db.prepare('SELECT * FROM employees ORDER BY created_at DESC').all()
    res.json(employees)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/employees', (req, res) => {
  try {
    const emp = req.body
    const result = req.db.prepare(`
      INSERT INTO employees (name, employee_id, department, designation, basic_salary, hra, transport, medical, special, pf_rate, esi_rate, total_leaves, leaves_taken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      emp.name, emp.employee_id, emp.department, emp.designation,
      emp.basic_salary, emp.hra, emp.transport, emp.medical, emp.special,
      emp.pf_rate, emp.esi_rate, emp.total_leaves, emp.leaves_taken
    )
    res.json({ id: result.lastInsertRowid, ...emp })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/employees/:id', (req, res) => {
  try {
    const { id } = req.params
    const emp = req.body
    req.db.prepare(`
      UPDATE employees
      SET name = ?, employee_id = ?, department = ?, designation = ?, basic_salary = ?, hra = ?, transport = ?, medical = ?, special = ?, pf_rate = ?, esi_rate = ?, total_leaves = ?, leaves_taken = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      emp.name, emp.employee_id, emp.department, emp.designation,
      emp.basic_salary, emp.hra, emp.transport, emp.medical, emp.special,
      emp.pf_rate, emp.esi_rate, emp.total_leaves, emp.leaves_taken, id
    )
    res.json({ id, ...emp })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/employees/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM employees WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router

