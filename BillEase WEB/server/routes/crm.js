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

// Customers
router.get('/customers', (req, res) => {
  try {
    const customers = req.db.prepare('SELECT * FROM crm_customers ORDER BY created_at DESC').all()
    res.json(customers || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.get('/customers/:id', (req, res) => {
  try {
    const { id } = req.params
    const customer = req.db.prepare('SELECT * FROM crm_customers WHERE id = ?').get(id)
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json(customer)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/customers', (req, res) => {
  try {
    const { name, email, phone, address, status, company, notes } = req.body
    
    // Validate required fields
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' })
    }
    
    // Validate email format if provided
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' })
      }
    }
    
    const result = req.db.prepare(`
      INSERT INTO crm_customers (name, email, phone, address, status, company, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(name.trim(), email || '', phone || '', address || '', status || 'Active', company || '', notes || '')
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    // If table doesn't exist yet, try to initialize
    if (error.message && error.message.includes('no such table')) {
      return res.status(503).json({ error: 'Database not initialized. Please restart the server.' })
    }
    res.status(500).json({ error: error.message })
  }
})

router.put('/customers/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, address, status, company, notes } = req.body
    req.db.prepare(`
      UPDATE crm_customers
      SET name = ?, email = ?, phone = ?, address = ?, status = ?, company = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, email || '', phone || '', address || '', status || 'Active', company || '', notes || '', id)
    res.json({ id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/customers/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM crm_customers WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Leads
router.get('/leads', (req, res) => {
  try {
    const { status } = req.query
    let query = 'SELECT * FROM crm_leads'
    if (status) {
      query += ' WHERE status = ?'
      const leads = req.db.prepare(query + ' ORDER BY created_at DESC').all(status)
      return res.json(leads || [])
    }
    const leads = req.db.prepare(query + ' ORDER BY created_at DESC').all()
    res.json(leads || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.get('/leads/:id', (req, res) => {
  try {
    const { id } = req.params
    const lead = req.db.prepare('SELECT * FROM crm_leads WHERE id = ?').get(id)
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' })
    }
    res.json(lead)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/leads', (req, res) => {
  try {
    const { name, email, phone, company, source, status, value, notes, assigned_to } = req.body
    const result = req.db.prepare(`
      INSERT INTO crm_leads (name, email, phone, company, source, status, value, notes, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, email || '', phone || '', company || '', source || '', status || 'New', value || 0, notes || '', assigned_to || '')
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/leads/:id', (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, company, source, status, value, notes, assigned_to } = req.body
    req.db.prepare(`
      UPDATE crm_leads
      SET name = ?, email = ?, phone = ?, company = ?, source = ?, status = ?, value = ?, notes = ?, assigned_to = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, email || '', phone || '', company || '', source || '', status || 'New', value || 0, notes || '', assigned_to || '', id)
    res.json({ id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/leads/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM crm_leads WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Activities
router.get('/activities', (req, res) => {
  try {
    const { customer_id, lead_id } = req.query
    let query = 'SELECT * FROM crm_activities'
    const conditions = []
    if (customer_id) conditions.push(`customer_id = ${customer_id}`)
    if (lead_id) conditions.push(`lead_id = ${lead_id}`)
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    const activities = req.db.prepare(query + ' ORDER BY date DESC, time DESC').all()
    res.json(activities || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/activities', (req, res) => {
  try {
    const { customer_id, lead_id, type, title, description, date, time, status } = req.body
    const result = req.db.prepare(`
      INSERT INTO crm_activities (customer_id, lead_id, type, title, description, date, time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(customer_id || null, lead_id || null, type, title, description || '', date, time || '', status || 'Pending')
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/activities/:id', (req, res) => {
  try {
    const { id } = req.params
    const { type, title, description, date, time, status } = req.body
    req.db.prepare(`
      UPDATE crm_activities
      SET type = ?, title = ?, description = ?, date = ?, time = ?, status = ?
      WHERE id = ?
    `).run(type, title, description || '', date, time || '', status || 'Pending', id)
    res.json({ id, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/activities/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM crm_activities WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Communications
router.get('/communications', (req, res) => {
  try {
    const { customer_id, lead_id } = req.query
    let query = 'SELECT * FROM crm_communications'
    const conditions = []
    if (customer_id) conditions.push(`customer_id = ${customer_id}`)
    if (lead_id) conditions.push(`lead_id = ${lead_id}`)
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    const communications = req.db.prepare(query + ' ORDER BY date DESC, created_at DESC').all()
    res.json(communications || [])
  } catch (error) {
    // If table doesn't exist yet, return empty array
    if (error.message && error.message.includes('no such table')) {
      return res.json([])
    }
    res.status(500).json({ error: error.message })
  }
})

router.post('/communications', (req, res) => {
  try {
    const { customer_id, lead_id, type, subject, content, date } = req.body
    const result = req.db.prepare(`
      INSERT INTO crm_communications (customer_id, lead_id, type, subject, content, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(customer_id || null, lead_id || null, type, subject || '', content, date)
    res.json({ id: result.lastInsertRowid, ...req.body })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/communications/:id', (req, res) => {
  try {
    const { id } = req.params
    req.db.prepare('DELETE FROM crm_communications WHERE id = ?').run(id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Analytics
router.get('/analytics', (req, res) => {
  try {
    const totalCustomers = req.db.prepare('SELECT COUNT(*) as count FROM crm_customers').get() || { count: 0 }
    const activeCustomers = req.db.prepare("SELECT COUNT(*) as count FROM crm_customers WHERE status = 'Active'").get() || { count: 0 }
    const totalLeads = req.db.prepare('SELECT COUNT(*) as count FROM crm_leads').get() || { count: 0 }
    const convertedLeads = req.db.prepare("SELECT COUNT(*) as count FROM crm_leads WHERE status = 'Converted'").get() || { count: 0 }
    const totalValue = req.db.prepare('SELECT COALESCE(SUM(value), 0) as total FROM crm_leads').get() || { total: 0 }
    const pendingActivities = req.db.prepare("SELECT COUNT(*) as count FROM crm_activities WHERE status = 'Pending'").get() || { count: 0 }
    
    res.json({
      totalCustomers: totalCustomers.count || 0,
      activeCustomers: activeCustomers.count || 0,
      totalLeads: totalLeads.count || 0,
      convertedLeads: convertedLeads.count || 0,
      totalValue: totalValue.total || 0,
      pendingActivities: pendingActivities.count || 0
    })
  } catch (error) {
    // If tables don't exist yet, return zeros
    if (error.message && error.message.includes('no such table')) {
      return res.json({
        totalCustomers: 0,
        activeCustomers: 0,
        totalLeads: 0,
        convertedLeads: 0,
        totalValue: 0,
        pendingActivities: 0
      })
    }
    res.status(500).json({ error: error.message })
  }
})

export default router

