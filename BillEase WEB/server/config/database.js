/**
 * Database Configuration
 * Determines which database adapter to use based on environment
 */

export function getDatabaseConfig() {
  const dbType = process.env.DB_TYPE || 'sqlite' // 'supabase' or 'sqlite'

  if (dbType === 'supabase') {
    return {
      type: 'supabase',
      config: {
        url: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    }
  }

  // Default to SQLite
  return {
    type: 'sqlite',
    config: {
      dbPath: process.env.DB_PATH || null // null = default path
    }
  }
}

