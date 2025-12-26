-- ============================================
-- BILLEASE SUITE - OPTIMIZED DATABASE SCHEMA
-- Fast Authentication & Per-User Data Storage
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- For query performance monitoring

-- ============================================
-- TABLE: stock_items (Optimized for Performance)
-- ============================================

CREATE TABLE IF NOT EXISTS public.stock_items (
    -- Primary Key with automatic UUID generation
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Product Information
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    
    -- Stock Tracking (integers for fast calculations)
    opening_stock INTEGER DEFAULT 0 NOT NULL,
    stock_in INTEGER DEFAULT 0 NOT NULL,
    stock_out INTEGER DEFAULT 0 NOT NULL,
    adjustments INTEGER DEFAULT 0 NOT NULL,
    closing_stock INTEGER DEFAULT 0 NOT NULL,
    
    -- Pricing (numeric for precise calculations)
    unit TEXT DEFAULT 'pcs' NOT NULL,
    cost_price NUMERIC(10,2) DEFAULT 0 NOT NULL,
    stock_value NUMERIC(10,2) DEFAULT 0 NOT NULL,
    
    -- User Isolation (enforces data separation)
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Timestamps (with timezone for global apps)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- INDEXES - Critical for Fast Queries
-- ============================================

-- Primary index on user_id (MOST IMPORTANT - filters all queries)
CREATE INDEX IF NOT EXISTS idx_stock_items_user_id 
    ON public.stock_items(user_id);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_stock_items_user_category 
    ON public.stock_items(user_id, category);

CREATE INDEX IF NOT EXISTS idx_stock_items_user_location 
    ON public.stock_items(user_id, location);

-- Index for search queries (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_stock_items_name_lower 
    ON public.stock_items(user_id, LOWER(name));

CREATE INDEX IF NOT EXISTS idx_stock_items_sku_lower 
    ON public.stock_items(user_id, LOWER(sku));

-- Index for date range queries
CREATE INDEX IF NOT EXISTS idx_stock_items_created_at 
    ON public.stock_items(user_id, created_at DESC);

-- Partial index for low stock alerts (only items with low stock)
CREATE INDEX IF NOT EXISTS idx_stock_items_low_stock 
    ON public.stock_items(user_id, closing_stock) 
    WHERE closing_stock < 10;

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Data Isolation
-- ============================================

-- Enable RLS to ensure users only see their own data
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only SELECT their own records
CREATE POLICY "Users can view their own stock items" 
    ON public.stock_items FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can only INSERT with their own user_id
CREATE POLICY "Users can insert their own stock items" 
    ON public.stock_items FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only UPDATE their own records
CREATE POLICY "Users can update their own stock items" 
    ON public.stock_items FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only DELETE their own records
CREATE POLICY "Users can delete their own stock items" 
    ON public.stock_items FOR DELETE 
    USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS - Auto-Update Timestamps
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before every UPDATE
CREATE TRIGGER update_stock_items_updated_at 
    BEFORE UPDATE ON public.stock_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION: Calculate Stock Value
-- ============================================

-- Function to automatically calculate stock_value
CREATE OR REPLACE FUNCTION calculate_stock_value()
RETURNS TRIGGER AS $$
BEGIN
    NEW.stock_value = NEW.closing_stock * NEW.cost_price;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate stock value
CREATE TRIGGER calculate_stock_value_trigger
    BEFORE INSERT OR UPDATE ON public.stock_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_stock_value();

-- ============================================
-- PERFORMANCE OPTIMIZATION: Materialized View
-- For faster summary queries (optional)
-- ============================================

CREATE MATERIALIZED VIEW IF NOT EXISTS stock_summary_by_user AS
SELECT 
    user_id,
    COUNT(*) as total_items,
    SUM(opening_stock) as total_opening_stock,
    SUM(stock_in) as total_stock_in,
    SUM(stock_out) as total_stock_out,
    SUM(closing_stock) as total_closing_stock,
    SUM(stock_value) as total_stock_value,
    MAX(updated_at) as last_updated
FROM public.stock_items
GROUP BY user_id;

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_stock_summary_user 
    ON stock_summary_by_user(user_id);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_stock_summary()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY stock_summary_by_user;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.stock_items TO authenticated;
GRANT SELECT ON stock_summary_by_user TO authenticated;

-- ============================================
-- TABLE: user_preferences (Cache user settings)
-- ============================================

CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    default_category TEXT,
    default_location TEXT,
    currency TEXT DEFAULT 'INR',
    timezone TEXT DEFAULT 'Asia/Kolkata',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own preferences" 
    ON public.user_preferences FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment and run after user registration
-- Replace 'YOUR_USER_ID_HERE' with actual user ID from auth.users

/*
INSERT INTO public.stock_items 
(name, sku, category, location, opening_stock, stock_in, stock_out, adjustments, closing_stock, unit, cost_price, user_id)
VALUES
('Tata Salt 1kg', 'SALT001', 'Grocery', 'Rack A1', 100, 100, 50, 0, 150, 'pcs', 25.00, 'YOUR_USER_ID_HERE'),
('Amul Butter 500g', 'BUTR001', 'Dairy', 'Cold Storage', 50, 20, 58, 0, 12, 'pcs', 250.00, 'YOUR_USER_ID_HERE'),
('Maggi Noodles 70g', 'NOOD001', 'Instant Food', 'Rack B2', 150, 200, 140, -10, 200, 'pcs', 12.00, 'YOUR_USER_ID_HERE'),
('Parle-G Biscuits', 'BISC001', 'Snacks', 'Rack C1', 100, 50, 70, 0, 80, 'pcs', 75.00, 'YOUR_USER_ID_HERE'),
('Surf Excel 1kg', 'DETG001', 'Household', 'Rack D3', 50, 0, 42, 0, 8, 'pcs', 175.00, 'YOUR_USER_ID_HERE');
*/

-- ============================================
-- PERFORMANCE TIPS
-- ============================================

-- 1. Regularly analyze tables for optimal query planning
-- Run this periodically (automated in production):
-- ANALYZE public.stock_items;

-- 2. Monitor slow queries
-- SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;

-- 3. Check index usage
-- SELECT schemaname, tablename, indexname, idx_scan 
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY idx_scan;

-- ============================================
-- BACKUP & RESTORE
-- ============================================

-- Backup specific user data
-- pg_dump -h your-host -U postgres -t stock_items -W your-db > backup.sql

-- Restore
-- psql -h your-host -U postgres -d your-db < backup.sql

-- ============================================
-- SUCCESS!
-- ============================================

-- Your database is now optimized for:
-- ✅ Fast authentication checks (indexed user_id)
-- ✅ Efficient per-user data isolation (RLS)
-- ✅ Quick filtering (composite indexes)
-- ✅ Fast search queries (lowercase indexes)
-- ✅ Automatic calculations (triggers)
-- ✅ Data integrity (foreign keys + RLS)
-- ✅ Scalability (proper indexing strategy)

SELECT 'Database schema created and optimized successfully! 🚀' as status;
