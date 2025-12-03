import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, 'billease.db')

let db
let dbReady = false
let dbPromise = null

// Initialize database - async function
export async function initDb() {
  if (dbReady) return db
  if (dbPromise) return dbPromise
  
  dbPromise = (async () => {
  // Try to use better-sqlite3, fallback to sqlite3
  try {
    const Database = (await import('better-sqlite3')).default
    db = new Database(dbPath)
    db.pragma('foreign_keys = ON')
    console.log('Using better-sqlite3')
  } catch (e) {
    console.log('better-sqlite3 not available, using sqlite3')
    const sqlite3 = (await import('sqlite3')).default
    const { open } = await import('sqlite')
    
    const sqliteDb = await open({
      filename: dbPath,
      driver: sqlite3.Database
    })
    
    await sqliteDb.exec('PRAGMA foreign_keys = ON')
    
    // Create a synchronous compatibility wrapper
    db = {
      exec: (sql) => {
        sqliteDb.exec(sql)
      },
      prepare: (sql) => {
        const stmt = sqliteDb.prepare(sql)
        return {
          all: (...params) => stmt.all(...params),
          get: (...params) => stmt.get(...params),
          run: (...params) => {
            const result = stmt.run(...params)
            return { lastInsertRowid: result.lastID }
          }
        }
      }
    }
  }
  
  // Initialize database tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS warehouses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      capacity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS inventory_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      quantity INTEGER DEFAULT 0,
      unit TEXT DEFAULT 'pcs',
      location TEXT,
      min_stock INTEGER DEFAULT 0,
      cost REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stock_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('in', 'out')),
      quantity INTEGER NOT NULL,
      date DATE NOT NULL,
      location TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS income_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expense_categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      date DATE NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS pos_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT,
      sku TEXT UNIQUE,
      barcode TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pos_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('customer', 'supplier')),
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      gstin TEXT,
      contact TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pos_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_no TEXT UNIQUE NOT NULL,
      date DATE NOT NULL,
      entity_id INTEGER,
      entity_type TEXT CHECK(entity_type IN ('customer', 'supplier')),
      invoice_type TEXT CHECK(invoice_type IN ('cash', 'credit', 'partial')),
      total REAL NOT NULL,
      paid REAL DEFAULT 0,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entity_id) REFERENCES pos_entities(id)
    );

    CREATE TABLE IF NOT EXISTS pos_sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES pos_sales(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES pos_products(id)
    );

    CREATE TABLE IF NOT EXISTS pos_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      receipt_no TEXT UNIQUE NOT NULL,
      date DATE NOT NULL,
      entity_id INTEGER,
      entity_type TEXT CHECK(entity_type IN ('customer', 'supplier')),
      amount REAL NOT NULL,
      payment_mode TEXT CHECK(payment_mode IN ('cash', 'card', 'bank', 'upi')),
      reference TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entity_id) REFERENCES pos_entities(id)
    );

    CREATE TABLE IF NOT EXISTS pos_quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_no TEXT UNIQUE NOT NULL,
      date DATE NOT NULL,
      entity_id INTEGER,
      entity_type TEXT CHECK(entity_type IN ('customer', 'supplier')),
      valid_until DATE,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (entity_id) REFERENCES pos_entities(id)
    );

    CREATE TABLE IF NOT EXISTS pos_quotation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quotation_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      discount REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      FOREIGN KEY (quotation_id) REFERENCES pos_quotations(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES pos_products(id)
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      phone TEXT,
      email TEXT,
      website TEXT,
      gstin TEXT,
      pan TEXT,
      business_type TEXT,
      opening_period TEXT,
      accounting_year TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ledgers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Asset', 'Liability', 'Income', 'Expense', 'Equity')),
      opening_balance REAL DEFAULT 0,
      parent_group TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS parties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('Customer', 'Supplier')),
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      contact TEXT,
      email TEXT,
      gstin TEXT,
      pan TEXT,
      credit_limit REAL DEFAULT 0,
      opening_balance REAL DEFAULT 0,
      classification TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS items_master (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      hsn TEXT,
      sac TEXT,
      uom TEXT DEFAULT 'PCS',
      rate REAL DEFAULT 0,
      cost_price REAL DEFAULT 0,
      reorder_level INTEGER DEFAULT 0,
      category TEXT,
      brand TEXT,
      group_name TEXT,
      opening_stock INTEGER DEFAULT 0,
      opening_value REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expense_heads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'Expense',
      ledger TEXT,
      recurring BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS income_heads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT DEFAULT 'Income',
      ledger TEXT,
      recurring BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      employee_id TEXT UNIQUE NOT NULL,
      department TEXT,
      designation TEXT,
      basic_salary REAL DEFAULT 0,
      hra REAL DEFAULT 0,
      transport REAL DEFAULT 0,
      medical REAL DEFAULT 0,
      special REAL DEFAULT 0,
      pf_rate REAL DEFAULT 12,
      esi_rate REAL DEFAULT 0.75,
      total_leaves INTEGER DEFAULT 12,
      leaves_taken INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Insert default categories
  const incomeCategories = db.prepare('SELECT COUNT(*) as count FROM income_categories').get()
  if (incomeCategories.count === 0) {
    const insertIncome = db.prepare('INSERT INTO income_categories (name) VALUES (?)')
    const defaultIncome = ['Sales', 'Services', 'Investment', 'Other']
    defaultIncome.forEach(cat => insertIncome.run(cat))
  }

  const expenseCategories = db.prepare('SELECT COUNT(*) as count FROM expense_categories').get()
  if (expenseCategories.count === 0) {
    const insertExpense = db.prepare('INSERT INTO expense_categories (name) VALUES (?)')
    const defaultExpense = ['Rent', 'Utilities', 'Salary', 'Marketing', 'Other']
    defaultExpense.forEach(cat => insertExpense.run(cat))
  }

    console.log('Database initialized successfully')
    dbReady = true
    return db
  })()
  
  return dbPromise
}

// Initialize database tables (for backward compatibility)
export const initDatabase = () => {
  // This will be called after initDb() completes
  console.log('Database already initialized')
}

// Export db getter - waits for initialization
export async function getDb() {
  if (!dbReady && !dbPromise) {
    await initDb()
  } else if (dbPromise) {
    await dbPromise
  }
  return db
}

// Default export - returns promise that resolves to db
export default new Proxy({}, {
  get(target, prop) {
    if (!dbReady) {
      throw new Error('Database not initialized. Call initDb() first.')
    }
    return db[prop]
  }
})
