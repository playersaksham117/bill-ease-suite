/**
 * Supabase Database Adapter
 * Implements DatabaseAdapter for Supabase (PostgreSQL)
 */

import { createClient } from '@supabase/supabase-js'
import { DatabaseAdapter } from './adapter.js'

export class SupabaseAdapter extends DatabaseAdapter {
  constructor(config) {
    super()
    this.config = config
    this.client = null
    this.initialized = false
  }

  async init() {
    if (this.initialized) return this

    const { url, anonKey, serviceRoleKey } = this.config

    if (!url || !anonKey) {
      throw new Error('Supabase URL and anon key are required')
    }

    // Use service role key for server-side operations (bypasses RLS)
    // Use anon key for client-side operations
    const key = serviceRoleKey || anonKey

    this.client = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Test connection
    try {
      const { error } = await this.client.from('companies').select('id').limit(1)
      if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected on first run)
        console.warn('Supabase connection test:', error.message)
      }
    } catch (error) {
      console.warn('Supabase connection test failed:', error.message)
    }

    this.initialized = true
    console.log('Supabase adapter initialized')
    return this
  }

  async select(table, options = {}) {
    if (!this.initialized) await this.init()

    let query = this.client.from(table).select(options.select || '*')

    // Apply WHERE conditions
    if (options.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Handle operators: ['eq', value], ['neq', value], ['gt', value], etc.
          const [op, val] = value
          query = query[op](key, val)
        } else {
          query = query.eq(key, value)
        }
      })
    }

    // Apply ORDER BY
    if (options.orderBy) {
      const { column, direction = 'asc' } = options.orderBy
      query = query.order(column, { ascending: direction === 'asc' })
    }

    // Apply LIMIT
    if (options.limit) {
      query = query.limit(options.limit)
    }

    // Apply OFFSET
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 1000) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`)
    }

    return data || []
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

    const { data: result, error } = await this.client
      .from(table)
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Supabase insert error: ${error.message}`)
    }

    return result
  }

  async update(table, data, where) {
    if (!this.initialized) await this.init()

    // Add updated_at timestamp
    data.updated_at = new Date().toISOString()

    let query = this.client.from(table).update(data)

    // Apply WHERE conditions
    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          const [op, val] = value
          query = query[op](key, val)
        } else {
          query = query.eq(key, value)
        }
      })
    }

    const { data: result, error } = await query.select()

    if (error) {
      throw new Error(`Supabase update error: ${error.message}`)
    }

    return result
  }

  async delete(table, where) {
    if (!this.initialized) await this.init()

    let query = this.client.from(table).delete()

    // Apply WHERE conditions
    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          const [op, val] = value
          query = query[op](key, val)
        } else {
          query = query.eq(key, value)
        }
      })
    }

    const { data, error } = await query.select()

    if (error) {
      throw new Error(`Supabase delete error: ${error.message}`)
    }

    return data?.length || 0
  }

  async query(sql, params = []) {
    // Supabase doesn't support raw SQL queries directly
    // This would require using PostgREST or direct PostgreSQL connection
    // For now, throw an error suggesting to use the query builder methods
    throw new Error('Raw SQL queries not supported in Supabase adapter. Use select/insert/update/delete methods.')
  }

  async beginTransaction() {
    // Supabase handles transactions automatically via PostgREST
    // For complex transactions, we'd need direct PostgreSQL connection
    return { id: Date.now() }
  }

  async commit(transaction) {
    // No-op for Supabase
    return true
  }

  async rollback(transaction) {
    // No-op for Supabase
    return true
  }

  getType() {
    return 'supabase'
  }

  /**
   * Get Supabase client for advanced operations
   */
  getClient() {
    return this.client
  }

  /**
   * Subscribe to realtime changes
   */
  subscribe(table, callback, filter = {}) {
    if (!this.initialized) {
      throw new Error('Adapter not initialized')
    }

    const channel = this.client
      .channel(`${table}_changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      }, callback)
      .subscribe()

    return () => {
      this.client.removeChannel(channel)
    }
  }
}

