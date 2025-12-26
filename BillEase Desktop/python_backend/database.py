"""
Database models and initialization for BillEase Suite
Supports SQLite, MySQL, and PostgreSQL
"""
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, Date, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(20))
    phone = Column(String(20))
    email = Column(String(255))
    website = Column(String(255))
    gstin = Column(String(15))
    pan = Column(String(10))
    business_type = Column(String(100))
    opening_period = Column(String(50))
    accounting_year = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user")  # admin, controller, manager, accountant, user
    is_active = Column(Boolean, default=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Ledger(Base):
    __tablename__ = "ledgers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # Asset, Liability, Income, Expense, Equity
    opening_balance = Column(Float, default=0)
    parent_group = Column(String(100))
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Party(Base):
    __tablename__ = "parties"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)  # Customer, Supplier
    address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(20))
    contact = Column(String(20))
    email = Column(String(255))
    gstin = Column(String(15))
    pan = Column(String(10))
    credit_limit = Column(Float, default=0)
    opening_balance = Column(Float, default=0)
    classification = Column(String(100))
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ItemMaster(Base):
    __tablename__ = "items_master"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    hsn = Column(String(10))
    sac = Column(String(10))
    uom = Column(String(20), default="PCS")
    rate = Column(Float, default=0)
    cost_price = Column(Float, default=0)
    reorder_level = Column(Integer, default=0)
    category = Column(String(100))
    brand = Column(String(100))
    group_name = Column(String(100))
    opening_stock = Column(Integer, default=0)
    opening_value = Column(Float, default=0)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SalesInvoice(Base):
    __tablename__ = "sales_invoices"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String(100), unique=True, nullable=False, index=True)
    date = Column(Date, nullable=False)
    party_id = Column(Integer, ForeignKey("parties.id"))
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0)
    discount_amount = Column(Float, default=0)
    grand_total = Column(Float, nullable=False)
    paid_amount = Column(Float, default=0)
    balance_amount = Column(Float, default=0)
    status = Column(String(50), default="draft")  # draft, confirmed, paid, cancelled
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SalesInvoiceItem(Base):
    __tablename__ = "sales_invoice_items"
    
    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("sales_invoices.id", ondelete="CASCADE"))
    item_id = Column(Integer, ForeignKey("items_master.id"))
    item_name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    discount = Column(Float, default=0)
    tax_rate = Column(Float, default=0)
    tax_amount = Column(Float, default=0)
    total = Column(Float, nullable=False)

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"
    
    id = Column(Integer, primary_key=True, index=True)
    po_no = Column(String(100), unique=True, nullable=False, index=True)
    date = Column(Date, nullable=False)
    party_id = Column(Integer, ForeignKey("parties.id"))
    expected_delivery_date = Column(Date)
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="pending")  # pending, partially_received, completed, cancelled
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("purchase_orders.id", ondelete="CASCADE"))
    item_id = Column(Integer, ForeignKey("items_master.id"))
    item_name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    received_quantity = Column(Float, default=0)
    total = Column(Float, nullable=False)

class DebitNote(Base):
    __tablename__ = "debit_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    note_no = Column(String(100), unique=True, nullable=False, index=True)
    date = Column(Date, nullable=False)
    reference_invoice_id = Column(Integer, ForeignKey("sales_invoices.id"))
    party_id = Column(Integer, ForeignKey("parties.id"))
    reason = Column(String(100))  # Additional Charges, Price Revision, Short Billing, Other
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0)
    grand_total = Column(Float, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class DebitNoteItem(Base):
    __tablename__ = "debit_note_items"
    
    id = Column(Integer, primary_key=True, index=True)
    debit_note_id = Column(Integer, ForeignKey("debit_notes.id", ondelete="CASCADE"))
    item_id = Column(Integer, ForeignKey("items_master.id"))
    item_name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    tax_rate = Column(Float, default=0)
    tax_amount = Column(Float, default=0)
    total = Column(Float, nullable=False)

class CreditNote(Base):
    __tablename__ = "credit_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    note_no = Column(String(100), unique=True, nullable=False, index=True)
    date = Column(Date, nullable=False)
    reference_invoice_id = Column(Integer, ForeignKey("sales_invoices.id"))
    party_id = Column(Integer, ForeignKey("parties.id"))
    reason = Column(String(100))  # Return, Discount, Over Billing, Cancellation, Other
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0)
    grand_total = Column(Float, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class CreditNoteItem(Base):
    __tablename__ = "credit_note_items"
    
    id = Column(Integer, primary_key=True, index=True)
    credit_note_id = Column(Integer, ForeignKey("credit_notes.id", ondelete="CASCADE"))
    item_id = Column(Integer, ForeignKey("items_master.id"))
    item_name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    rate = Column(Float, nullable=False)
    tax_rate = Column(Float, default=0)
    tax_amount = Column(Float, default=0)
    total = Column(Float, nullable=False)

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    employee_id = Column(String(100), unique=True, nullable=False, index=True)
    department = Column(String(100))
    designation = Column(String(100))
    basic_salary = Column(Float, default=0)
    hra = Column(Float, default=0)
    transport = Column(Float, default=0)
    medical = Column(Float, default=0)
    special = Column(Float, default=0)
    pf_rate = Column(Float, default=12.0)
    esi_rate = Column(Float, default=0.75)
    total_leaves = Column(Integer, default=12)
    leaves_taken = Column(Integer, default=0)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Payroll(Base):
    __tablename__ = "payrolls"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    month = Column(String(20), nullable=False)
    year = Column(Integer, nullable=False)
    basic_salary = Column(Float, default=0)
    hra = Column(Float, default=0)
    transport = Column(Float, default=0)
    medical = Column(Float, default=0)
    special = Column(Float, default=0)
    gross_salary = Column(Float, default=0)
    pf = Column(Float, default=0)
    esi = Column(Float, default=0)
    tds = Column(Float, default=0)
    other_deductions = Column(Float, default=0)
    net_salary = Column(Float, default=0)
    leaves_taken = Column(Integer, default=0)
    status = Column(String(50), default="draft")  # draft, processed, paid
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BankTransaction(Base):
    __tablename__ = "bank_transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    description = Column(Text)
    amount = Column(Float, nullable=False)
    type = Column(String(20), nullable=False)  # credit, debit
    balance = Column(Float, default=0)
    reference = Column(String(100))
    bank_account = Column(String(100))
    company_id = Column(Integer, ForeignKey("companies.id"))
    reconciled = Column(Boolean, default=False)
    reconciled_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)

class GSTR1(Base):
    __tablename__ = "gstr1"
    
    id = Column(Integer, primary_key=True, index=True)
    period = Column(String(20), nullable=False)  # MM-YYYY
    invoice_id = Column(Integer, ForeignKey("sales_invoices.id"))
    gstin = Column(String(15))
    invoice_no = Column(String(100))
    invoice_date = Column(Date)
    taxable_value = Column(Float, default=0)
    igst = Column(Float, default=0)
    cgst = Column(Float, default=0)
    sgst = Column(Float, default=0)
    total_tax = Column(Float, default=0)
    status = Column(String(50), default="draft")  # draft, filed
    irn = Column(String(100))  # Invoice Reference Number for e-invoice
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

# Global session maker (set by main.py)
AsyncSessionLocal = None

async def get_db():
    """Dependency to get database session"""
    if AsyncSessionLocal is None:
        raise RuntimeError("Database not initialized. Call main.py to start the server.")
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

async def init_db():
    """Initialize database with default data"""
    from sqlalchemy import select
    from sqlalchemy.ext.asyncio import AsyncSession
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy.ext.asyncio import create_async_engine
    import bcrypt
    from config import get_database_url, settings
    
    DATABASE_URL = get_database_url()
    engine = create_async_engine(DATABASE_URL, echo=False)
    AsyncSessionLocal_temp = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with AsyncSessionLocal_temp() as session:
        # Create default admin user if not exists
        result = await session.execute(select(User).where(User.username == "admin"))
        admin_user = result.scalar_one_or_none()
        
        if not admin_user:
            # Use bcrypt directly instead of passlib to avoid compatibility issues
            password = "admin123"
            password_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(password_bytes, salt).decode('utf-8')
            
            admin_user = User(
                username="admin",
                email="admin@billease.com",
                password_hash=password_hash,
                role="admin",
                is_active=True
            )
            session.add(admin_user)
            await session.commit()
    
    await engine.dispose()
