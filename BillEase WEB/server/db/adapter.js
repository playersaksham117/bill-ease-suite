/**
 * Database Adapter Interface
 * Defines the contract for database adapters (Supabase, SQLite, etc.)
 */

export class DatabaseAdapter {
  /**
   * Initialize the database connection
   */
  async init() {
    throw new Error('init() must be implemented by adapter')
  }

  /**
   * Execute a SELECT query
   * @param {string} table - Table name
   * @param {object} options - Query options (where, orderBy, limit, etc.)
   * @returns {Promise<Array>} Query results
   */
  async select(table, options = {}) {
    throw new Error('select() must be implemented by adapter')
  }

  /**
   * Execute a SELECT query for a single record
   * @param {string} table - Table name
   * @param {object} options - Query options
   * @returns {Promise<object|null>} Single record or null
   */
  async selectOne(table, options = {}) {
    throw new Error('selectOne() must be implemented by adapter')
  }

  /**
   * Insert a record
   * @param {string} table - Table name
   * @param {object} data - Record data
   * @returns {Promise<object>} Inserted record with ID
   */
  async insert(table, data) {
    throw new Error('insert() must be implemented by adapter')
  }

  /**
   * Update records
   * @param {string} table - Table name
   * @param {object} data - Update data
   * @param {object} where - Where conditions
   * @returns {Promise<object>} Updated record(s)
   */
  async update(table, data, where) {
    throw new Error('update() must be implemented by adapter')
  }

  /**
   * Delete records
   * @param {string} table - Table name
   * @param {object} where - Where conditions
   * @returns {Promise<number>} Number of deleted records
   */
  async delete(table, where) {
    throw new Error('delete() must be implemented by adapter')
  }

  /**
   * Execute raw SQL query (for complex operations)
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<any>} Query result
   */
  async query(sql, params = []) {
    throw new Error('query() must be implemented by adapter')
  }

  /**
   * Begin a transaction
   * @returns {Promise<object>} Transaction object
   */
  async beginTransaction() {
    throw new Error('beginTransaction() must be implemented by adapter')
  }

  /**
   * Commit a transaction
   * @param {object} transaction - Transaction object
   */
  async commit(transaction) {
    throw new Error('commit() must be implemented by adapter')
  }

  /**
   * Rollback a transaction
   * @param {object} transaction - Transaction object
   */
  async rollback(transaction) {
    throw new Error('rollback() must be implemented by adapter')
  }

  /**
   * Get the database type
   * @returns {string} 'supabase' or 'sqlite'
   */
  getType() {
    throw new Error('getType() must be implemented by adapter')
  }
}

