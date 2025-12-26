/**
 * Database Service
 * Unified interface for database operations that works with both Supabase (web) and SQLite (desktop)
 */

import { SupabaseAdapter } from './supabase-adapter.js'
import { SQLiteAdapter } from './sqlite-adapter.js'

class DatabaseService {
  constructor() {
    this.adapter = null
    this.dbType = null
    this.initialized = false
  }

  /**
   * Initialize the database service
   * @param {string} type - 'supabase' or 'sqlite'
   * @param {object} config - Configuration for the adapter
   */
  async init(type = 'sqlite', config = {}) {
    if (this.initialized && this.dbType === type) {
      return this
    }

    // Determine database type from environment or config
    const dbType = type || process.env.DB_TYPE || 'sqlite'
    this.dbType = dbType

    if (dbType === 'supabase') {
      const supabaseConfig = {
        url: config.url || process.env.SUPABASE_URL,
        anonKey: config.anonKey || process.env.SUPABASE_ANON_KEY,
        serviceRoleKey: config.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY
      }
      this.adapter = new SupabaseAdapter(supabaseConfig)
    } else {
      // Default to SQLite
      this.adapter = new SQLiteAdapter(config.dbPath)
    }

    await this.adapter.init()
    this.initialized = true

    console.log(`Database service initialized with ${dbType}`)
    return this
  }

  /**
   * Get the current database adapter
   */
  getAdapter() {
    if (!this.initialized) {
      throw new Error('Database service not initialized. Call init() first.')
    }
    return this.adapter
  }

  /**
   * Get database type
   */
  getType() {
    return this.dbType
  }

  // Delegate all methods to adapter
  async select(table, options) {
    return this.getAdapter().select(table, options)
  }

  async selectOne(table, options) {
    return this.getAdapter().selectOne(table, options)
  }

  async insert(table, data) {
    return this.getAdapter().insert(table, data)
  }

  async update(table, data, where) {
    return this.getAdapter().update(table, data, where)
  }

  async delete(table, where) {
    return this.getAdapter().delete(table, where)
  }

  async query(sql, params) {
    return this.getAdapter().query(sql, params)
  }

  async beginTransaction() {
    return this.getAdapter().beginTransaction()
  }

  async commit(transaction) {
    return this.getAdapter().commit(transaction)
  }

  async rollback(transaction) {
    return this.getAdapter().rollback(transaction)
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Export class for testing
export { DatabaseService }

