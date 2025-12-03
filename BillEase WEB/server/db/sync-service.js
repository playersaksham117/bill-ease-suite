/**
 * Sync Service
 * Handles synchronization between Supabase (cloud) and SQLite (local)
 * Implements conflict resolution using "last write wins" strategy
 */

import { db as databaseService } from './database-service.js'
import { SupabaseAdapter } from './supabase-adapter.js'
import { SQLiteAdapter } from './sqlite-adapter.js'

export class SyncService {
  constructor() {
    this.supabaseAdapter = null
    this.sqliteAdapter = null
    this.syncQueue = []
    this.isOnline = true
    this.syncInProgress = false
  }

  /**
   * Initialize sync service with both adapters
   */
  async init(supabaseConfig, sqliteConfig = {}) {
    // Initialize Supabase adapter
    this.supabaseAdapter = new SupabaseAdapter(supabaseConfig)
    await this.supabaseAdapter.init()

    // Initialize SQLite adapter
    this.sqliteAdapter = new SQLiteAdapter(sqliteConfig.dbPath)
    await this.sqliteAdapter.init()

    // Check online status
    this.checkOnlineStatus()

    console.log('Sync service initialized')
  }

  /**
   * Check if online and update status
   */
  async checkOnlineStatus() {
    try {
      // Try to ping Supabase
      await this.supabaseAdapter.select('companies', { limit: 1 })
      this.isOnline = true
    } catch (error) {
      this.isOnline = false
    }
    return this.isOnline
  }

  /**
   * Sync data from Supabase to SQLite (pull)
   * @param {string} table - Table name to sync
   * @param {object} options - Sync options (since timestamp, etc.)
   */
  async pullFromSupabase(table, options = {}) {
    if (!this.isOnline) {
      console.warn('Cannot pull: offline')
      return { synced: 0, errors: [] }
    }

    try {
      // Get data from Supabase
      const supabaseData = await this.supabaseAdapter.select(table, {
        orderBy: { column: 'updated_at', direction: 'desc' },
        ...options
      })

      let synced = 0
      const errors = []

      // Upsert into SQLite
      for (const record of supabaseData) {
        try {
          // Check if record exists in SQLite
          const existing = await this.sqliteAdapter.selectOne(table, {
            where: { id: record.id }
          })

          if (existing) {
            // Update if Supabase version is newer (last write wins)
            const supabaseTime = new Date(record.updated_at || record.created_at)
            const localTime = new Date(existing.updated_at || existing.created_at)

            if (supabaseTime >= localTime) {
              await this.sqliteAdapter.update(table, record, { id: record.id })
              synced++
            }
          } else {
            // Insert new record
            await this.sqliteAdapter.insert(table, record)
            synced++
          }
        } catch (error) {
          errors.push({ record: record.id, error: error.message })
        }
      }

      return { synced, errors }
    } catch (error) {
      console.error(`Error pulling ${table} from Supabase:`, error)
      return { synced: 0, errors: [{ error: error.message }] }
    }
  }

  /**
   * Sync data from SQLite to Supabase (push)
   * @param {string} table - Table name to sync
   * @param {object} options - Sync options
   */
  async pushToSupabase(table, options = {}) {
    if (!this.isOnline) {
      // Queue for later sync
      this.syncQueue.push({ type: 'push', table, options })
      return { synced: 0, queued: true }
    }

    try {
      // Get data from SQLite
      const sqliteData = await this.sqliteAdapter.select(table, {
        orderBy: { column: 'updated_at', direction: 'desc' },
        ...options
      })

      let synced = 0
      const errors = []

      // Upsert into Supabase
      for (const record of sqliteData) {
        try {
          // Check if record exists in Supabase
          const existing = await this.supabaseAdapter.selectOne(table, {
            where: { id: record.id }
          })

          if (existing) {
            // Update if local version is newer (last write wins)
            const localTime = new Date(record.updated_at || record.created_at)
            const supabaseTime = new Date(existing.updated_at || existing.created_at)

            if (localTime >= supabaseTime) {
              await this.supabaseAdapter.update(table, record, { id: record.id })
              synced++
            }
          } else {
            // Insert new record
            await this.supabaseAdapter.insert(table, record)
            synced++
          }
        } catch (error) {
          errors.push({ record: record.id, error: error.message })
        }
      }

      return { synced, errors }
    } catch (error) {
      console.error(`Error pushing ${table} to Supabase:`, error)
      // Queue for later
      this.syncQueue.push({ type: 'push', table, options })
      return { synced: 0, queued: true, errors: [{ error: error.message }] }
    }
  }

  /**
   * Full bidirectional sync
   * @param {Array<string>} tables - Tables to sync
   */
  async syncAll(tables) {
    if (this.syncInProgress) {
      console.warn('Sync already in progress')
      return
    }

    this.syncInProgress = true

    try {
      // Check online status
      await this.checkOnlineStatus()

      const results = {}

      for (const table of tables) {
        console.log(`Syncing ${table}...`)

        // Pull from Supabase (cloud -> local)
        const pullResult = await this.pullFromSupabase(table)
        results[table] = { pull: pullResult }

        // Push to Supabase (local -> cloud)
        const pushResult = await this.pushToSupabase(table)
        results[table].push = pushResult

        console.log(`${table}: Pulled ${pullResult.synced}, Pushed ${pushResult.synced}`)
      }

      // Process queued operations
      await this.processSyncQueue()

      return results
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * Process queued sync operations
   */
  async processSyncQueue() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return
    }

    console.log(`Processing ${this.syncQueue.length} queued sync operations...`)

    const queue = [...this.syncQueue]
    this.syncQueue = []

    for (const operation of queue) {
      try {
        if (operation.type === 'push') {
          await this.pushToSupabase(operation.table, operation.options)
        }
      } catch (error) {
        console.error('Error processing queued operation:', error)
        // Re-queue failed operations
        this.syncQueue.push(operation)
      }
    }
  }

  /**
   * Get sync queue status
   */
  getQueueStatus() {
    return {
      queued: this.syncQueue.length,
      isOnline: this.isOnline,
      syncInProgress: this.syncInProgress
    }
  }

  /**
   * Clear sync queue
   */
  clearQueue() {
    this.syncQueue = []
  }
}

// Export singleton instance
export const syncService = new SyncService()

