# Supabase Integration Guide

This guide explains how to set up BillEase Suite with Supabase (PostgreSQL) for web deployment.

## Architecture

- **Web Version**: Uses Supabase (PostgreSQL) - Cloud database with realtime sync
- **Desktop Version**: Uses SQLite - Local offline database that syncs with Supabase

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2. Run Database Schema

1. Open Supabase SQL Editor
2. Copy and paste the contents of `server/db/supabase-schema.sql`
3. Run the SQL to create all tables

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Use Supabase for web
DB_TYPE=supabase

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Server Configuration
PORT=3001
```

### 4. Install Dependencies

```bash
cd server
npm install
```

### 5. Start Server

```bash
npm run dev
```

## Database Service Layer

The application uses a unified database service that automatically switches between Supabase and SQLite based on configuration.

### Usage in Routes

```javascript
import { db } from '../db/database-service.js'

// Select records
const items = await db.select('inventory_items', {
  where: { quantity: ['lt', 10] },
  orderBy: { column: 'name', direction: 'asc' },
  limit: 100
})

// Select one record
const item = await db.selectOne('inventory_items', {
  where: { id: 1 }
})

// Insert record
const newItem = await db.insert('inventory_items', {
  name: 'Product Name',
  sku: 'SKU123',
  quantity: 100
})

// Update record
await db.update('inventory_items', 
  { quantity: 150 },
  { id: 1 }
)

// Delete record
await db.delete('inventory_items', { id: 1 })
```

## Sync System (Desktop App)

The sync service handles bidirectional synchronization between Supabase and SQLite:

### Sync Endpoint

```bash
POST /api/sync
Content-Type: application/json

{
  "tables": ["companies", "inventory_items", "pos_products"]
}
```

### Conflict Resolution

- **Strategy**: Last Write Wins
- Uses `updated_at` timestamp to determine which version is newer
- Desktop app syncs when online
- Changes are queued when offline and synced when connection is restored

### Manual Sync

```javascript
import { syncService } from './db/sync-service.js'

// Sync all tables
const results = await syncService.syncAll([
  'companies',
  'inventory_items',
  'pos_products',
  'pos_sales',
  'transactions'
])

// Pull from Supabase
await syncService.pullFromSupabase('inventory_items')

// Push to Supabase
await syncService.pushToSupabase('inventory_items')
```

## Realtime Features

Supabase provides realtime subscriptions for live updates:

```javascript
import { db } from './db/database-service.js'

const adapter = db.getAdapter()
if (adapter.getType() === 'supabase') {
  const unsubscribe = adapter.subscribe('inventory_items', (payload) => {
    console.log('Change:', payload)
    // Update UI with new data
  })
  
  // Later, unsubscribe
  unsubscribe()
}
```

## Migration from SQLite to Supabase

1. Export data from SQLite
2. Import into Supabase using the Supabase dashboard or API
3. Update environment variables to use Supabase
4. Restart server

## Troubleshooting

### Connection Issues

- Verify Supabase URL and keys are correct
- Check network connectivity
- Ensure Supabase project is active

### Schema Mismatches

- Run `supabase-schema.sql` in Supabase SQL Editor
- Verify all tables exist
- Check column types match

### Sync Issues

- Check online status: `syncService.checkOnlineStatus()`
- View sync queue: `syncService.getQueueStatus()`
- Clear queue if needed: `syncService.clearQueue()`

## Security

- Use Service Role Key only on server-side
- Use Anon Key for client-side operations
- Configure Row Level Security (RLS) policies in Supabase
- Never expose Service Role Key in client code

## Performance

- Supabase automatically handles connection pooling
- Use indexes for frequently queried columns
- Consider pagination for large datasets
- Use select() with limit/offset for pagination

