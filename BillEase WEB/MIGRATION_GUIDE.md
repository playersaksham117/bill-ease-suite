# Database Migration Guide: SQLite to Supabase

This guide explains how to migrate routes from the old database system to the new Supabase-compatible database service.

## Overview

The new database service provides a unified interface that works with both:
- **Supabase (PostgreSQL)** - For web deployment
- **SQLite** - For desktop/offline use

## Key Changes

### Old System (database-simple.js)
```javascript
import { getDb } from '../database-simple.js'

const db = await getDb()
const items = db.prepare('SELECT * FROM items WHERE id = ?').get(id)
```

### New System (database-service.js)
```javascript
import { db } from '../db/database-service.js'

const item = await db.selectOne('items', { where: { id } })
```

## Route Migration Steps

### Step 1: Update Imports

**Before:**
```javascript
import { getDb } from '../database-simple.js'
```

**After:**
```javascript
import { db } from '../db/database-service.js'
```

### Step 2: Replace Database Operations

#### SELECT Queries

**Before:**
```javascript
const db = await getDb()
const stmt = db.prepare('SELECT * FROM items WHERE quantity < ?')
const items = stmt.all(10)
```

**After:**
```javascript
const items = await db.select('items', {
  where: { quantity: ['lt', 10] }
})
```

#### SELECT One Record

**Before:**
```javascript
const stmt = db.prepare('SELECT * FROM items WHERE id = ?')
const item = stmt.get(id)
```

**After:**
```javascript
const item = await db.selectOne('items', {
  where: { id }
})
```

#### INSERT

**Before:**
```javascript
const stmt = db.prepare('INSERT INTO items (name, quantity) VALUES (?, ?)')
const result = stmt.run(name, quantity)
const newItem = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid)
```

**After:**
```javascript
const newItem = await db.insert('items', {
  name,
  quantity
})
```

#### UPDATE

**Before:**
```javascript
const stmt = db.prepare('UPDATE items SET quantity = ? WHERE id = ?')
stmt.run(newQuantity, id)
```

**After:**
```javascript
await db.update('items', 
  { quantity: newQuantity },
  { id }
)
```

#### DELETE

**Before:**
```javascript
const stmt = db.prepare('DELETE FROM items WHERE id = ?')
stmt.run(id)
```

**After:**
```javascript
await db.delete('items', { id })
```

### Step 3: Make Route Handlers Async

All database operations are now async, so route handlers must be async:

**Before:**
```javascript
router.get('/items', (req, res) => {
  const db = await getDb() // Error: can't use await in non-async function
  // ...
})
```

**After:**
```javascript
router.get('/items', async (req, res) => {
  try {
    const items = await db.select('items')
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

### Step 4: Remove Table Initialization

Table initialization is now handled by `schema.js`. Remove table creation code from routes.

**Before:**
```javascript
const initTables = async () => {
  const db = await getDb()
  db.exec(`CREATE TABLE IF NOT EXISTS items (...)`)
}
initTables()
```

**After:**
```javascript
// Tables are initialized automatically by schema.js
// No initialization code needed in routes
```

## Complete Example: Route Migration

### Before (invento.js)

```javascript
import express from 'express'
import { getDb } from '../database-simple.js'

const router = express.Router()

router.get('/items', async (req, res) => {
  try {
    const db = await getDb()
    const items = db.prepare('SELECT * FROM invento_items').all()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/items', async (req, res) => {
  try {
    const db = await getDb()
    const { name, sku, quantity } = req.body
    const stmt = db.prepare('INSERT INTO invento_items (name, sku, quantity) VALUES (?, ?, ?)')
    const result = stmt.run(name, sku, quantity)
    const newItem = db.prepare('SELECT * FROM invento_items WHERE id = ?').get(result.lastInsertRowid)
    res.json(newItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

### After (invento.js)

```javascript
import express from 'express'
import { db } from '../db/database-service.js'

const router = express.Router()

router.get('/items', async (req, res) => {
  try {
    const items = await db.select('invento_items', {
      orderBy: { column: 'created_at', direction: 'desc' }
    })
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/items', async (req, res) => {
  try {
    const { name, sku, quantity } = req.body
    const newItem = await db.insert('invento_items', {
      name,
      sku,
      quantity: quantity || 0
    })
    res.json(newItem)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

## Query Options Reference

### WHERE Conditions

```javascript
// Simple equality
where: { id: 1 }

// Operators
where: {
  quantity: ['lt', 10],      // less than
  quantity: ['gt', 5],       // greater than
  quantity: ['gte', 0],      // greater than or equal
  quantity: ['lte', 100],    // less than or equal
  quantity: ['neq', 0],      // not equal
  name: ['like', '%product%'], // LIKE
  status: ['in', ['active', 'pending']] // IN
}
```

### ORDER BY

```javascript
orderBy: {
  column: 'created_at',
  direction: 'desc' // or 'asc'
}
```

### LIMIT and OFFSET

```javascript
limit: 50,
offset: 0
```

### Combined Example

```javascript
const items = await db.select('invento_items', {
  where: {
    quantity: ['lt', 10],
    category: 'Electronics'
  },
  orderBy: { column: 'name', direction: 'asc' },
  limit: 20,
  offset: 0
})
```

## Error Handling

Always wrap database operations in try-catch:

```javascript
router.get('/items/:id', async (req, res) => {
  try {
    const item = await db.selectOne('items', {
      where: { id: parseInt(req.params.id) }
    })
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' })
    }
    
    res.json(item)
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: error.message })
  }
})
```

## Testing

After migration, test all endpoints:

1. **GET** - Verify data retrieval
2. **POST** - Verify data insertion
3. **PUT** - Verify data updates
4. **DELETE** - Verify data deletion
5. **Query filters** - Verify WHERE conditions work
6. **Pagination** - Verify LIMIT/OFFSET work

## Next Steps

1. Update all route files one by one
2. Test each route after migration
3. Update frontend API calls if needed
4. Deploy and test with Supabase

## Support

For issues or questions:
- Check `README_SUPABASE.md` for Supabase setup
- Review `server/db/database-service.js` for API reference
- Check adapter files for implementation details

