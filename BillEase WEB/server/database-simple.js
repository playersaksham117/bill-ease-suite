// Simple in-memory database adapter (no native compilation required)
// This is a temporary solution until better-sqlite3 can be compiled

let db = {
  data: {},
  exec: function(sql) {
    // Simple SQL executor for CREATE TABLE statements
    // Tables are stored as arrays in db.data
    const createMatch = sql.match(/CREATE TABLE IF NOT EXISTS (\w+)/i)
    if (createMatch) {
      const tableName = createMatch[1]
      if (!this.data[tableName]) {
        this.data[tableName] = []
        this.schema[tableName] = sql
      }
    }
  },
  schema: {},
  prepare: function(sql) {
    const self = this
    return {
      all: function(...params) {
        return self.query(sql, params, 'all')
      },
      get: function(...params) {
        return self.query(sql, params, 'get')
      },
      run: function(...params) {
        return self.query(sql, params, 'run')
      }
    }
  },
  query: function(sql, params, type) {
    sql = sql.trim()
    
    // SELECT queries
    if (sql.toUpperCase().startsWith('SELECT')) {
      const tableMatch = sql.match(/FROM (\w+)/i)
      if (!tableMatch) return type === 'all' ? [] : null
      
      const tableName = tableMatch[1]
      const data = this.data[tableName] || []
      
      // Simple WHERE clause handling
      let filtered = data
      if (sql.includes('WHERE')) {
        const whereMatch = sql.match(/WHERE (\w+) = \?/i)
        if (whereMatch && params.length > 0) {
          const field = whereMatch[1]
          const value = params[0]
          filtered = data.filter(row => row[field] == value)
        }
      }
      
      // ORDER BY handling
      if (sql.includes('ORDER BY')) {
        const orderMatch = sql.match(/ORDER BY (\w+)(?:\s+(ASC|DESC))?/i)
        if (orderMatch) {
          const field = orderMatch[1]
          const desc = orderMatch[2] && orderMatch[2].toUpperCase() === 'DESC'
          filtered.sort((a, b) => {
            if (desc) return (b[field] || '').localeCompare(a[field] || '')
            return (a[field] || '').localeCompare(b[field] || '')
          })
        }
      }
      
      return type === 'all' ? filtered : (filtered[0] || null)
    }
    
    // INSERT queries
    if (sql.toUpperCase().startsWith('INSERT')) {
      const tableMatch = sql.match(/INTO (\w+)/i)
      if (!tableMatch) return { lastInsertRowid: 0 }
      
      const tableName = tableMatch[1]
      if (!this.data[tableName]) this.data[tableName] = []
      
      const fieldsMatch = sql.match(/\(([^)]+)\)/g)
      if (!fieldsMatch || fieldsMatch.length < 2) return { lastInsertRowid: 0 }
      
      const fields = fieldsMatch[0].slice(1, -1).split(',').map(f => f.trim())
      const valuesPlaceholders = fieldsMatch[1] ? fieldsMatch[1].split(',').map(v => v.trim()) : []
      
      // Count ? placeholders to determine how many params to use
      const placeholderCount = valuesPlaceholders.filter(v => v === '?').length
      const values = params.slice(0, placeholderCount || fields.length)
      
      const maxId = this.data[tableName].length > 0 
        ? Math.max(...this.data[tableName].map(r => r.id || 0))
        : 0
      const row = { id: maxId + 1 }
      
      fields.forEach((field, i) => {
        if (i < values.length) {
          row[field] = values[i] !== null && values[i] !== undefined ? values[i] : null
        } else {
          // Handle default values or CURRENT_TIMESTAMP
          const placeholder = valuesPlaceholders[i]
          if (placeholder && placeholder.includes('CURRENT_TIMESTAMP')) {
            row[field] = new Date().toISOString()
          } else {
            row[field] = null
          }
        }
      })
      
      this.data[tableName].push(row)
      return { lastInsertRowid: row.id }
    }
    
    // UPDATE queries
    if (sql.toUpperCase().startsWith('UPDATE')) {
      const tableMatch = sql.match(/UPDATE (\w+)/i)
      if (!tableMatch) return { changes: 0 }
      
      const tableName = tableMatch[1]
      const data = this.data[tableName] || []
      
      if (sql.includes('WHERE')) {
        const whereMatch = sql.match(/WHERE (\w+) = \?/i)
        if (whereMatch && params.length > 0) {
          const field = whereMatch[1]
          const id = params[params.length - 1] // Last param is usually the ID
          const row = data.find(r => r.id == id || r[field] == params[0])
          if (row) {
            const setMatch = sql.match(/SET (.+?) WHERE/i)
            if (setMatch) {
              const setClause = setMatch[1]
              // Parse SET clause - handle multiple fields with ? placeholders
              const updates = setClause.split(',').map(s => s.trim())
              let paramIndex = 0
              updates.forEach(update => {
                const parts = update.split('=').map(s => s.trim())
                if (parts.length === 2) {
                  const field = parts[0]
                  const value = parts[1]
                  if (value === '?') {
                    row[field] = params[paramIndex] !== null && params[paramIndex] !== undefined ? params[paramIndex] : null
                    paramIndex++
                  } else if (value.includes('CURRENT_TIMESTAMP')) {
                    row[field] = new Date().toISOString()
                  } else if (!isNaN(value)) {
                    row[field] = parseFloat(value)
                  } else {
                    row[field] = value.replace(/['"]/g, '')
                  }
                }
              })
            }
          }
        }
      }
      return { changes: 1 }
    }
    
    // DELETE queries
    if (sql.toUpperCase().startsWith('DELETE')) {
      const tableMatch = sql.match(/FROM (\w+)/i)
      if (!tableMatch) return { changes: 0 }
      
      const tableName = tableMatch[1]
      const data = this.data[tableName] || []
      
      if (sql.includes('WHERE')) {
        const whereMatch = sql.match(/WHERE (\w+) = \?/i)
        if (whereMatch && params.length > 0) {
          const field = whereMatch[1]
          const value = params[0]
          const index = data.findIndex(r => r[field] == value)
          if (index >= 0) {
            data.splice(index, 1)
            return { changes: 1 }
          }
        }
      }
      return { changes: 0 }
    }
    
    return type === 'all' ? [] : (type === 'get' ? null : { lastInsertRowid: 0 })
  }
}

db.pragma = function(key) {
  // No-op for pragma
}

export async function initDb() {
  console.log('Using simple in-memory database (no native compilation required)')
  return db
}

export async function getDb() {
  return db
}

export const initDatabase = () => {
  // Initialize tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS warehouses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      capacity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
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
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS invento_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      date TEXT NOT NULL,
      location TEXT,
      notes TEXT,
      reference TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // Income/Expense tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date TEXT NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      mode TEXT DEFAULT 'individual',
      member_id INTEGER,
      payment_method TEXT DEFAULT 'cash',
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS income_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS expense_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      period TEXT NOT NULL,
      mode TEXT DEFAULT 'individual',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS recurring_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      frequency TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      notes TEXT,
      mode TEXT DEFAULT 'individual',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS family_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // CRM tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS crm_customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      status TEXT DEFAULT 'Active',
      company TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS crm_leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      company TEXT,
      source TEXT,
      status TEXT DEFAULT 'New',
      value REAL,
      notes TEXT,
      assigned_to TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS crm_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      lead_id INTEGER,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS crm_communications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      lead_id INTEGER,
      type TEXT NOT NULL,
      subject TEXT,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // POS tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT,
      sku TEXT,
      barcode TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      gstin TEXT,
      contact TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no TEXT NOT NULL,
      date TEXT NOT NULL,
      entity_id INTEGER,
      entity_type TEXT,
      invoice_type TEXT,
      total REAL NOT NULL,
      paid REAL DEFAULT 0,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_no TEXT NOT NULL,
      date TEXT NOT NULL,
      entity_id INTEGER,
      entity_type TEXT,
      amount REAL NOT NULL,
      payment_mode TEXT,
      reference TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_no TEXT NOT NULL,
      date TEXT NOT NULL,
      entity_id INTEGER,
      entity_type TEXT,
      valid_until TEXT,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_quotation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL
    )
  `)
  
  // Initialize default categories
  const defaultIncomeCats = ['Salary', 'Business', 'Investment', 'Other']
  const defaultExpenseCats = ['Food', 'Transport', 'Utilities', 'Shopping', 'Entertainment', 'Health', 'Education', 'Other']
  
  defaultIncomeCats.forEach(cat => {
    try {
      const existing = db.prepare('SELECT * FROM income_categories WHERE name = ?').get(cat)
      if (!existing) {
        db.prepare('INSERT INTO income_categories (name) VALUES (?)').run(cat)
      }
    } catch (e) {
      // Category already exists or table doesn't exist yet
    }
  })
  
  defaultExpenseCats.forEach(cat => {
    try {
      const existing = db.prepare('SELECT * FROM expense_categories WHERE name = ?').get(cat)
      if (!existing) {
        db.prepare('INSERT INTO expense_categories (name) VALUES (?)').run(cat)
      }
    } catch (e) {
      // Category already exists or table doesn't exist yet
    }
  })
  
  console.log('Database initialized successfully (in-memory)')
}

export default db

