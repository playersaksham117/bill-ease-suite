# Supabase Database Schema

## Overview
This document describes the database schema for the BillEase Suite stock management system.

## Tables

### stock_items

Main table for storing inventory stock items.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| `id` | UUID | Primary key | NOT NULL, DEFAULT uuid_generate_v4() |
| `name` | TEXT | Product name | NOT NULL |
| `sku` | TEXT | Stock Keeping Unit | NOT NULL |
| `category` | TEXT | Product category | NOT NULL |
| `location` | TEXT | Storage location | NOT NULL |
| `opening_stock` | INTEGER | Opening stock quantity | DEFAULT 0 |
| `stock_in` | INTEGER | Quantity added | DEFAULT 0 |
| `stock_out` | INTEGER | Quantity removed | DEFAULT 0 |
| `adjustments` | INTEGER | Manual adjustments | DEFAULT 0 |
| `closing_stock` | INTEGER | Current stock quantity | DEFAULT 0 |
| `unit` | TEXT | Unit of measurement | DEFAULT 'pcs' |
| `cost_price` | DECIMAL(10,2) | Cost per unit | DEFAULT 0 |
| `stock_value` | DECIMAL(10,2) | Total stock value | DEFAULT 0 |
| `user_id` | UUID | Owner user ID | NOT NULL, FK to auth.users |
| `created_at` | TIMESTAMP | Creation timestamp | NOT NULL, DEFAULT NOW() |
| `updated_at` | TIMESTAMP | Last update timestamp | NOT NULL, DEFAULT NOW() |

### Indexes

- `idx_stock_items_user_id` - On `user_id` for user-specific queries
- `idx_stock_items_category` - On `category` for filtering
- `idx_stock_items_location` - On `location` for filtering

### Row Level Security (RLS)

**Enabled**: Yes

**Policies**:

1. **SELECT**: Users can view their own stock items
   ```sql
   auth.uid() = user_id
   ```

2. **INSERT**: Users can insert their own stock items
   ```sql
   auth.uid() = user_id
   ```

3. **UPDATE**: Users can update their own stock items
   ```sql
   auth.uid() = user_id
   ```

4. **DELETE**: Users can delete their own stock items
   ```sql
   auth.uid() = user_id
   ```

### Triggers

**update_stock_items_updated_at**: Automatically updates the `updated_at` timestamp on row updates.

## Relationships

- `stock_items.user_id` → `auth.users.id` (CASCADE DELETE)

## Sample Queries

### Get all stock items for a user
```sql
SELECT * FROM stock_items 
WHERE user_id = 'user-uuid-here' 
ORDER BY name;
```

### Get stock items by category
```sql
SELECT * FROM stock_items 
WHERE user_id = 'user-uuid-here' 
  AND category = 'Grocery'
ORDER BY name;
```

### Calculate total stock value
```sql
SELECT 
  SUM(stock_value) as total_value,
  SUM(closing_stock) as total_items
FROM stock_items 
WHERE user_id = 'user-uuid-here';
```

## Backup & Restore

Use Supabase CLI or Dashboard for backups:

```bash
# Backup (requires Supabase CLI)
supabase db dump -f backup.sql

# Restore
supabase db reset
psql -h db.project.supabase.co -U postgres -f backup.sql
```

## Performance Considerations

- Indexes are created on frequently queried columns
- RLS policies ensure data isolation
- `updated_at` trigger maintains audit trail
- Consider partitioning if stock_items exceeds 1M rows

## Future Enhancements

Potential additions to the schema:

- `stock_transactions` table for detailed transaction history
- `categories` table with predefined categories
- `locations` table with warehouse/storage details
- `suppliers` table for vendor management
- Full-text search indexes for product names
