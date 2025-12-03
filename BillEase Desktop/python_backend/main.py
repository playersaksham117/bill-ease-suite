"""
BillEase Suite - Python Backend Server
FastAPI-based REST API server for desktop application
Supports SQLite, MySQL, and PostgreSQL databases
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager
import uvicorn

from config import settings, get_database_url
from database import Base, init_db, get_db
import database as db_module
from routes import (
    auth, companies, ledgers, parties, items, 
    sales, purchases, inventory, crm, 
    income_expense, reports, payroll, gst, 
    bank_reconciliation, import_export
)

# Database setup
DATABASE_URL = get_database_url()
engine = create_async_engine(DATABASE_URL, echo=settings.debug)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Set the session local in database module so get_db() can use it
db_module.AsyncSessionLocal = AsyncSessionLocal

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await init_db()
    yield
    # Shutdown
    await engine.dispose()

app = FastAPI(
    title=settings.app_name,
    description="Comprehensive business management solution API",
    version=settings.app_version,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(ledgers.router, prefix="/api/ledgers", tags=["Ledgers"])
app.include_router(parties.router, prefix="/api/parties", tags=["Parties"])
app.include_router(items.router, prefix="/api/items", tags=["Items"])
app.include_router(sales.router, prefix="/api/sales", tags=["Sales"])
app.include_router(purchases.router, prefix="/api/purchases", tags=["Purchases"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["Inventory"])
app.include_router(crm.router, prefix="/api/crm", tags=["CRM"])
app.include_router(income_expense.router, prefix="/api/income-expense", tags=["Income & Expense"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(payroll.router, prefix="/api/payroll", tags=["Payroll"])
app.include_router(gst.router, prefix="/api/gst", tags=["GST"])
app.include_router(bank_reconciliation.router, prefix="/api/bank-reconciliation", tags=["Bank Reconciliation"])
app.include_router(import_export.router, prefix="/api/import-export", tags=["Import/Export"])

@app.get("/")
async def root():
    return {
        "message": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "database": settings.database_type
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "message": f"{settings.app_name} is running",
        "database": settings.database_type,
        "version": settings.app_version
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    )
