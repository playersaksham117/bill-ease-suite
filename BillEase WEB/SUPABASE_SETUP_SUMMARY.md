# Supabase Integration - Setup Summary

## ✅ What Has Been Created

### 1. Database Adapter System
- **`server/db/adapter.js`** - Base adapter interface
- **`server/db/supabase-adapter.js`** - Supabase (PostgreSQL) adapter
- **`server/db/sqlite-adapter.js`** - SQLite adapter (for desktop/offline)

### 2. Database Service Layer
- **`server/db/database-service.js`** - Unified database service that switches between Supabase and SQLite
- **`server/db/sync-service.js`** - Sync service for bidirectional sync between cloud and local

### 3. Schema Management
- **`server/db/schema.js`** - Schema initialization for SQLite
- **`server/db/supabase-schema.sql`** - PostgreSQL schema for Supabase

### 4. Configuration
- **`server/config/database.js`** - Database configuration loader
- **`server/.env.example`** - Environment variables template

### 5. Documentation
- **`README_SUPABASE.md`** - Complete Supabase setup guide
- **`MIGRATION_GUIDE.md`** - Guide for migrating routes to new database service

### 6. Updated Files
- **`server/server.js`** - Updated to use new database service
- **`server/package.json`** - Added @supabase/supabase-js dependency

## 🚀 Quick Start

### For Web (Supabase)

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up Supabase:**
   - Create project at https://app.supabase.com
   - Run `server/db/supabase-schema.sql` in SQL Editor
   - Copy project URL and API keys

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

### For Desktop (SQLite)

1. **Set environment:**
   ```env
   DB_TYPE=sqlite
   ```

2. **Start server:**
   ```bash
   npm run dev
   ```

## 📋 Next Steps

### 1. Update Route Files

All route files need to be migrated to use the new database service. See `MIGRATION_GUIDE.md` for details.

**Files to update:**
- `server/routes/invento.js`
- `server/routes/incomeExpense.js`
- `server/routes/pos.js`
- `server/routes/accountsPlus.js`
- `server/routes/crm.js`

### 2. Test Database Operations

After updating routes, test:
- ✅ Data retrieval (GET)
- ✅ Data insertion (POST)
- ✅ Data updates (PUT)
- ✅ Data deletion (DELETE)
- ✅ Query filters
- ✅ Pagination

### 3. Set Up Sync (Desktop App)

For desktop app with offline support:
- Initialize sync service with both adapters
- Call sync endpoints periodically
- Handle sync queue when offline

## 🔧 Architecture

```
┌─────────────────────────────────────────┐
│         Application Routes              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Database Service (db)              │
│  ┌──────────────┐  ┌──────────────┐    │
│  │   Supabase   │  │   SQLite     │    │
│  │   Adapter    │  │   Adapter    │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Sync Service                    │
│  (Bidirectional sync with conflict      │
│   resolution - last write wins)         │
└─────────────────────────────────────────┘
```

## 📊 Database Types

### Supabase (Web)
- ✅ Cloud-hosted PostgreSQL
- ✅ Realtime subscriptions
- ✅ Automatic backups
- ✅ Scalable
- ✅ Multi-user support

### SQLite (Desktop)
- ✅ Local file-based
- ✅ Fast performance
- ✅ Offline support
- ✅ Simple backup
- ✅ No server required

## 🔄 Sync Logic

1. **When Online:**
   - Pull latest changes from Supabase → SQLite
   - Push local changes from SQLite → Supabase
   - Resolve conflicts using `updated_at` timestamp (last write wins)

2. **When Offline:**
   - Use SQLite for all operations
   - Queue changes for sync
   - Sync when connection restored

## 🛠️ Usage Examples

### Basic Operations

```javascript
import { db } from './db/database-service.js'

// Select
const items = await db.select('items', {
  where: { quantity: ['lt', 10] },
  orderBy: { column: 'name', direction: 'asc' }
})

// Insert
const newItem = await db.insert('items', {
  name: 'Product',
  quantity: 100
})

// Update
await db.update('items', 
  { quantity: 150 },
  { id: 1 }
)

// Delete
await db.delete('items', { id: 1 })
```

### Sync Operations

```javascript
import { syncService } from './db/sync-service.js'

// Sync all tables
await syncService.syncAll([
  'companies',
  'inventory_items',
  'pos_products'
])
```

## ⚠️ Important Notes

1. **Environment Variables:** Never commit `.env` file with real credentials
2. **Service Role Key:** Only use on server-side, never expose to client
3. **Schema Migration:** Run Supabase schema SQL before using Supabase adapter
4. **Route Migration:** All routes must be updated to use new database service
5. **Testing:** Test thoroughly after migration

## 📚 Documentation Files

- `README_SUPABASE.md` - Complete setup guide
- `MIGRATION_GUIDE.md` - Route migration instructions
- `server/db/supabase-schema.sql` - Database schema
- `server/.env.example` - Environment template

## 🐛 Troubleshooting

### Connection Issues
- Verify Supabase URL and keys
- Check network connectivity
- Ensure project is active

### Schema Issues
- Run `supabase-schema.sql` in Supabase SQL Editor
- Verify all tables exist
- Check column types match

### Sync Issues
- Check online status
- View sync queue
- Clear queue if needed

## ✨ Features

- ✅ Unified database interface
- ✅ Automatic adapter switching
- ✅ Bidirectional sync
- ✅ Conflict resolution
- ✅ Offline support
- ✅ Realtime subscriptions (Supabase)
- ✅ Transaction support
- ✅ Query builder interface

