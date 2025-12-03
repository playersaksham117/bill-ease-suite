-- Supabase PostgreSQL Schema
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  gstin TEXT,
  pan TEXT,
  business_type TEXT,
  opening_period TEXT,
  accounting_year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warehouses
CREATE TABLE IF NOT EXISTS warehouses (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  capacity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory items
CREATE TABLE IF NOT EXISTS inventory_items (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  quantity INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  location TEXT,
  min_stock INTEGER DEFAULT 0,
  cost REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stock transactions
CREATE TABLE IF NOT EXISTS stock_transactions (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK(type IN ('in', 'out')),
  quantity INTEGER NOT NULL,
  date DATE NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Income/Expense categories
CREATE TABLE IF NOT EXISTS income_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
  description TEXT NOT NULL,
  amount REAL NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POS Products
CREATE TABLE IF NOT EXISTS pos_products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  sku TEXT UNIQUE,
  barcode TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POS Entities
CREATE TABLE IF NOT EXISTS pos_entities (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('customer', 'supplier')),
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  gstin TEXT,
  contact TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- POS Sales
CREATE TABLE IF NOT EXISTS pos_sales (
  id BIGSERIAL PRIMARY KEY,
  invoice_no TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  entity_id BIGINT REFERENCES pos_entities(id),
  entity_type TEXT CHECK(entity_type IN ('customer', 'supplier')),
  invoice_type TEXT CHECK(invoice_type IN ('cash', 'credit', 'partial')),
  total REAL NOT NULL,
  paid REAL DEFAULT 0,
  balance REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pos_sale_items (
  id BIGSERIAL PRIMARY KEY,
  sale_id BIGINT NOT NULL REFERENCES pos_sales(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES pos_products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  discount REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  total REAL NOT NULL
);

-- POS Payments
CREATE TABLE IF NOT EXISTS pos_payments (
  id BIGSERIAL PRIMARY KEY,
  receipt_no TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  entity_id BIGINT REFERENCES pos_entities(id),
  entity_type TEXT CHECK(entity_type IN ('customer', 'supplier')),
  amount REAL NOT NULL,
  payment_mode TEXT CHECK(payment_mode IN ('cash', 'card', 'bank', 'upi')),
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- POS Quotations
CREATE TABLE IF NOT EXISTS pos_quotations (
  id BIGSERIAL PRIMARY KEY,
  quote_no TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  entity_id BIGINT REFERENCES pos_entities(id),
  entity_type TEXT CHECK(entity_type IN ('customer', 'supplier')),
  valid_until DATE,
  total REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pos_quotation_items (
  id BIGSERIAL PRIMARY KEY,
  quotation_id BIGINT NOT NULL REFERENCES pos_quotations(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES pos_products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  discount REAL DEFAULT 0,
  tax REAL DEFAULT 0,
  total REAL NOT NULL
);

-- Ledgers
CREATE TABLE IF NOT EXISTS ledgers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('Asset', 'Liability', 'Income', 'Expense', 'Equity')),
  opening_balance REAL DEFAULT 0,
  parent_group TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parties
CREATE TABLE IF NOT EXISTS parties (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('Customer', 'Supplier')),
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  contact TEXT,
  email TEXT,
  gstin TEXT,
  pan TEXT,
  credit_limit REAL DEFAULT 0,
  opening_balance REAL DEFAULT 0,
  classification TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items Master
CREATE TABLE IF NOT EXISTS items_master (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  hsn TEXT,
  sac TEXT,
  uom TEXT DEFAULT 'PCS',
  rate REAL DEFAULT 0,
  cost_price REAL DEFAULT 0,
  reorder_level INTEGER DEFAULT 0,
  category TEXT,
  brand TEXT,
  group_name TEXT,
  opening_stock INTEGER DEFAULT 0,
  opening_value REAL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expense/Income Heads
CREATE TABLE IF NOT EXISTS expense_heads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Expense',
  ledger TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS income_heads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Income',
  ledger TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees
CREATE TABLE IF NOT EXISTS employees (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  department TEXT,
  designation TEXT,
  basic_salary REAL DEFAULT 0,
  hra REAL DEFAULT 0,
  transport REAL DEFAULT 0,
  medical REAL DEFAULT 0,
  special REAL DEFAULT 0,
  pf_rate REAL DEFAULT 12,
  esi_rate REAL DEFAULT 0.75,
  total_leaves INTEGER DEFAULT 12,
  leaves_taken INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CRM Tables
CREATE TABLE IF NOT EXISTS crm_customers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  status TEXT DEFAULT 'Active',
  company TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_leads (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT,
  status TEXT DEFAULT 'New',
  value REAL,
  notes TEXT,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES crm_customers(id),
  lead_id BIGINT REFERENCES crm_leads(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_communications (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES crm_customers(id),
  lead_id BIGINT REFERENCES crm_leads(id),
  type TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO income_categories (name) VALUES ('Sales'), ('Services'), ('Investment'), ('Other')
ON CONFLICT (name) DO NOTHING;

INSERT INTO expense_categories (name) VALUES ('Rent'), ('Utilities'), ('Salary'), ('Marketing'), ('Other')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_stock_transactions_item_id ON stock_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_pos_sales_date ON pos_sales(date);
CREATE INDEX IF NOT EXISTS idx_pos_sales_entity_id ON pos_sales(entity_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_crm_customers_status ON crm_customers(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON crm_leads(status);

-- Enable Row Level Security (RLS) - Optional, configure based on your needs
-- ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
-- etc.

