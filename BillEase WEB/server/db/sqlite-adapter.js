/**
 * SQLite Database Adapter
 * Implements DatabaseAdapter for SQLite (Desktop/Offline)
 */

import { DatabaseAdapter } from './adapter.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class SQLiteAdapter extends DatabaseAdapter {
  constructor(dbPath = null) {
    super()
    this.dbPath = dbPath || join(__dirname, '..', 'billease.db')
    this.db = null
    this.initialized = false
  }

  async init() {
    if (this.initialized) return this

    // Try to use better-sqlite3, fallback to sqlite3
    try {
      const Database = (await import('better-sqlite3')).default
      this.db = new Database(this.dbPath)
      this.db.pragma('foreign_keys = ON')
      console.log('Using better-sqlite3')
    } catch (e) {
      console.log('better-sqlite3 not available, using sqlite3')
      const sqlite3 = (await import('sqlite3')).default
      const { open } = await import('sqlite')
      
      const sqliteDb = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      })
      
      await sqliteDb.exec('PRAGMA foreign_keys = ON')
      
      // Create a synchronous compatibility wrapper
      this.db = {
        exec: (sql) => sqliteDb.exec(sql),
        prepare: (sql) => {
          const stmt = sqliteDb.prepare(sql)
          return {
            all: (...params) => stmt.all(...params),
            get: (...params) => stmt.get(...params),
            run: (...params) => {
              const result = stmt.run(...params)
              return { lastInsertRowid: result.lastID, changes: result.changes }
            }
          }
        }
      }
    }

    this.initialized = true
    console.log('SQLite adapter initialized')
    return this
  }

  async select(table, options = {}) {
    if (!this.initialized) await this.init()

    let sql = `SELECT ${options.select || '*'} FROM ${table}`
    const params = []

    // Build WHERE clause
    if (options.where) {
      const conditions = []
      Object.entries(options.where).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          const [op, val] = value
          const operators = {
            eq: '=',
            neq: '!=',
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<=',
            like: 'LIKE',
            in: 'IN'
          }
          if (op === 'in') {
            const placeholders = val.map(() => '?').join(', ')
            conditions.push(`${key} IN (${placeholders})`)
            params.push(...val)
          } else {
            conditions.push(`${key} ${operators[op] || '='} ?`)
            params.push(val)
          }
        } else {
          conditions.push(`${key} = ?`)
          params.push(value)
        }
      })
      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`
      }
    }

    // Apply ORDER BY
    if (options.orderBy) {
      const { column, direction = 'asc' } = options.orderBy
      sql += ` ORDER BY ${column} ${direction.toUpperCase()}`
    }

    // Apply LIMIT
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`
    }

    // Apply OFFSET
    if (options.offset) {
      sql += ` OFFSET ${options.offset}`
    }

    const stmt = this.db.prepare(sql)
    return stmt.all(...params)
  }

  async selectOne(table, options = {}) {
    const results = await this.select(table, { ...options, limit: 1 })
    return results[0] || null
  }

  async insert(table, data) {
    if (!this.initialized) await this.init()

    // Add timestamps if not present
    const now = new Date().toISOString()
    if (!data.created_at) data.created_at = now
    if (!data.updated_at) data.updated_at = now

    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => '?').join(', ')

    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`
    const stmt = this.db.prepare(sql)
    const result = stmt.run(...values)

    // Fetch the inserted record
    const inserted = await this.selectOne(table, { where: { id: result.lastInsertRowid } })
    return inserted
  }

  async update(table, data, where) {
    if (!this.initialized) await this.init()

    // Add updated_at timestamp
    data.updated_at = new Date().toISOString()

    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const setValues = Object.values(data)

    let sql = `UPDATE ${table} SET ${setClause}`
    const params = [...setValues]

    // Build WHERE clause
    if (where) {
      const conditions = []
      Object.entries(where).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          const [op, val] = value
          const operators = {
            eq: '=',
            neq: '!=',
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<='
          }
          conditions.push(`${key} ${operators[op] || '='} ?`)
          params.push(val)
        } else {
          conditions.push(`${key} = ?`)
          params.push(value)
        }
      })
      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`
      }
    }

    const stmt = this.db.prepare(sql)
    stmt.run(...params)

    // Fetch updated records
    const updated = await this.select(table, { where })
    return updated
  }

  async delete(table, where) {
    if (!this.initialized) await this.init()

    let sql = `DELETE FROM ${table}`
    const params = []

    // Build WHERE clause
    if (where) {
      const conditions = []
      Object.entries(where).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          const [op, val] = value
          const operators = {
            eq: '=',
            neq: '!=',
            gt: '>',
            gte: '>=',
            lt: '<',
            lte: '<='
          }
          conditions.push(`${key} ${operators[op] || '='} ?`)
          params.push(val)
        } else {
          conditions.push(`${key} = ?`)
          params.push(value)
        }
      })
      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(' AND ')}`
      }
    }

    const stmt = this.db.prepare(sql)
    const result = stmt.run(...params)
    return result.changes || 0
  }

  async query(sql, params = []) {
    if (!this.initialized) await this.init()

    const stmt = this.db.prepare(sql)
    
    // Determine if it's a SELECT query
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...params)
    } else {
      return stmt.run(...params)
    }
  }

  async beginTransaction() {
    if (!this.initialized) await this.init()
    this.db.exec('BEGIN TRANSACTION')
    return { id: Date.now() }
  }

  async commit(transaction) {
    if (!this.initialized) await this.init()
    this.db.exec('COMMIT')
    return true
  }

  async rollback(transaction) {
    if (!this.initialized) await this.init()
    this.db.exec('ROLLBACK')
    return true
  }

  getType() {
    return 'sqlite'
  }

  /**
   * Get raw database instance for advanced operations
   */
  getDb() {
    return this.db
  }

  /**
   * Execute raw SQL (for schema creation, etc.)
   */
  exec(sql) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized')
    }
    return this.db.exec(sql)
  }
}

