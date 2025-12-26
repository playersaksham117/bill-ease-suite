"""
Database models and operations for BillEase Suite Desktop
Uses SQLite for local storage
"""
import sqlite3
import os
from datetime import datetime
from typing import List, Dict, Optional, Any
import bcrypt

class Database:
    def __init__(self, db_path: str = "billease_desktop.db"):
        """Initialize database connection"""
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row  # Return rows as dictionaries
        self.cursor = self.conn.cursor()
    
    def execute(self, query: str, params: tuple = ()):
        """Execute a query"""
        return self.cursor.execute(query, params)
    
    def commit(self):
        """Commit changes"""
        self.conn.commit()
    
    def fetchall(self, query: str, params: tuple = ()):
        """Fetch all results"""
        self.cursor.execute(query, params)
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows]
    
    def fetchone(self, query: str, params: tuple = ()):
        """Fetch one result"""
        self.cursor.execute(query, params)
        row = self.cursor.fetchone()
        return dict(row) if row else None
    
    def close(self):
        """Close database connection"""
        self.conn.close()

def init_database():
    """Initialize database tables"""
    db = Database()
    
    # Users table
    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            is_active INTEGER DEFAULT 1,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Companies table
    db.execute("""
        CREATE TABLE IF NOT EXISTS companies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Ledgers table
    db.execute("""
        CREATE TABLE IF NOT EXISTS ledgers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            opening_balance REAL DEFAULT 0,
            parent_group TEXT,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Parties table
    db.execute("""
        CREATE TABLE IF NOT EXISTS parties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
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
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Items Master table
    db.execute("""
        CREATE TABLE IF NOT EXISTS items_master (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
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
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Sales Invoices table
    db.execute("""
        CREATE TABLE IF NOT EXISTS sales_invoices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_no TEXT UNIQUE NOT NULL,
            date TEXT NOT NULL,
            party_id INTEGER,
            total_amount REAL NOT NULL,
            tax_amount REAL DEFAULT 0,
            discount_amount REAL DEFAULT 0,
            grand_total REAL NOT NULL,
            paid_amount REAL DEFAULT 0,
            balance_amount REAL DEFAULT 0,
            status TEXT DEFAULT 'draft',
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (party_id) REFERENCES parties(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Sales Invoice Items table
    db.execute("""
        CREATE TABLE IF NOT EXISTS sales_invoice_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            invoice_id INTEGER NOT NULL,
            item_id INTEGER,
            item_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            rate REAL NOT NULL,
            discount REAL DEFAULT 0,
            tax_rate REAL DEFAULT 0,
            tax_amount REAL DEFAULT 0,
            total REAL NOT NULL,
            FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES items_master(id)
        )
    """)
    
    # Income & Expense table
    db.execute("""
        CREATE TABLE IF NOT EXISTS income_expense (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            type TEXT NOT NULL,
            category TEXT,
            description TEXT,
            amount REAL NOT NULL,
            payment_method TEXT,
            reference TEXT,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Inventory Transactions table
    db.execute("""
        CREATE TABLE IF NOT EXISTS inventory_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id INTEGER NOT NULL,
            transaction_type TEXT NOT NULL,
            quantity REAL NOT NULL,
            rate REAL,
            date TEXT NOT NULL,
            reference TEXT,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (item_id) REFERENCES items_master(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # CRM Contacts table
    db.execute("""
        CREATE TABLE IF NOT EXISTS crm_contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            company TEXT,
            designation TEXT,
            address TEXT,
            city TEXT,
            state TEXT,
            notes TEXT,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Purchase Orders table
    db.execute("""
        CREATE TABLE IF NOT EXISTS purchase_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            po_no TEXT UNIQUE NOT NULL,
            date TEXT NOT NULL,
            party_id INTEGER,
            expected_delivery_date TEXT,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (party_id) REFERENCES parties(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Purchase Order Items table
    db.execute("""
        CREATE TABLE IF NOT EXISTS purchase_order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            po_id INTEGER NOT NULL,
            item_id INTEGER,
            item_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            rate REAL NOT NULL,
            received_quantity REAL DEFAULT 0,
            total REAL NOT NULL,
            FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES items_master(id)
        )
    """)
    
    # Debit Notes table
    db.execute("""
        CREATE TABLE IF NOT EXISTS debit_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_no TEXT UNIQUE NOT NULL,
            date TEXT NOT NULL,
            reference_invoice_id INTEGER,
            party_id INTEGER,
            reason TEXT,
            total_amount REAL NOT NULL,
            tax_amount REAL DEFAULT 0,
            grand_total REAL NOT NULL,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reference_invoice_id) REFERENCES sales_invoices(id),
            FOREIGN KEY (party_id) REFERENCES parties(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Debit Note Items table
    db.execute("""
        CREATE TABLE IF NOT EXISTS debit_note_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            debit_note_id INTEGER NOT NULL,
            item_id INTEGER,
            item_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            rate REAL NOT NULL,
            tax_rate REAL DEFAULT 0,
            tax_amount REAL DEFAULT 0,
            total REAL NOT NULL,
            FOREIGN KEY (debit_note_id) REFERENCES debit_notes(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES items_master(id)
        )
    """)
    
    # Credit Notes table
    db.execute("""
        CREATE TABLE IF NOT EXISTS credit_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_no TEXT UNIQUE NOT NULL,
            date TEXT NOT NULL,
            reference_invoice_id INTEGER,
            party_id INTEGER,
            reason TEXT,
            total_amount REAL NOT NULL,
            tax_amount REAL DEFAULT 0,
            grand_total REAL NOT NULL,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (reference_invoice_id) REFERENCES sales_invoices(id),
            FOREIGN KEY (party_id) REFERENCES parties(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Credit Note Items table
    db.execute("""
        CREATE TABLE IF NOT EXISTS credit_note_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            credit_note_id INTEGER NOT NULL,
            item_id INTEGER,
            item_name TEXT NOT NULL,
            quantity REAL NOT NULL,
            rate REAL NOT NULL,
            tax_rate REAL DEFAULT 0,
            tax_amount REAL DEFAULT 0,
            total REAL NOT NULL,
            FOREIGN KEY (credit_note_id) REFERENCES credit_notes(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES items_master(id)
        )
    """)
    
    # Employees table
    db.execute("""
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            employee_id TEXT UNIQUE NOT NULL,
            department TEXT,
            designation TEXT,
            basic_salary REAL DEFAULT 0,
            hra REAL DEFAULT 0,
            transport REAL DEFAULT 0,
            medical REAL DEFAULT 0,
            special REAL DEFAULT 0,
            pf_rate REAL DEFAULT 12.0,
            esi_rate REAL DEFAULT 0.75,
            total_leaves INTEGER DEFAULT 12,
            leaves_taken INTEGER DEFAULT 0,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Payrolls table
    db.execute("""
        CREATE TABLE IF NOT EXISTS payrolls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER NOT NULL,
            month TEXT NOT NULL,
            year INTEGER NOT NULL,
            basic_salary REAL DEFAULT 0,
            hra REAL DEFAULT 0,
            transport REAL DEFAULT 0,
            medical REAL DEFAULT 0,
            special REAL DEFAULT 0,
            gross_salary REAL DEFAULT 0,
            pf REAL DEFAULT 0,
            esi REAL DEFAULT 0,
            tds REAL DEFAULT 0,
            other_deductions REAL DEFAULT 0,
            net_salary REAL DEFAULT 0,
            leaves_taken INTEGER DEFAULT 0,
            status TEXT DEFAULT 'draft',
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # Bank Transactions table
    db.execute("""
        CREATE TABLE IF NOT EXISTS bank_transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            description TEXT,
            amount REAL NOT NULL,
            type TEXT NOT NULL,
            balance REAL DEFAULT 0,
            reference TEXT,
            bank_account TEXT,
            company_id INTEGER,
            reconciled INTEGER DEFAULT 0,
            reconciled_date TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    # GSTR1 table
    db.execute("""
        CREATE TABLE IF NOT EXISTS gstr1 (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            period TEXT NOT NULL,
            invoice_id INTEGER,
            gstin TEXT,
            invoice_no TEXT,
            invoice_date TEXT,
            taxable_value REAL DEFAULT 0,
            igst REAL DEFAULT 0,
            cgst REAL DEFAULT 0,
            sgst REAL DEFAULT 0,
            total_tax REAL DEFAULT 0,
            status TEXT DEFAULT 'draft',
            irn TEXT,
            company_id INTEGER,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (invoice_id) REFERENCES sales_invoices(id),
            FOREIGN KEY (company_id) REFERENCES companies(id)
        )
    """)
    
    db.commit()
    
    # Create default admin user if not exists
    admin = db.fetchone("SELECT * FROM users WHERE username = ?", ("admin",))
    if not admin:
        password = "admin123"
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.execute("""
            INSERT INTO users (username, email, password_hash, role, is_active)
            VALUES (?, ?, ?, ?, ?)
        """, ("admin", "admin@billease.com", password_hash, "admin", 1))
        db.commit()
    
    db.close()
    print("Database initialized successfully!")

