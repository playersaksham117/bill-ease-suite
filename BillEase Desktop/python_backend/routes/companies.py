"""
Company management routes
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from database import Company, get_db
from routes.auth import get_current_user

router = APIRouter()

class CompanyCreate(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    gstin: Optional[str] = None
    pan: Optional[str] = None
    business_type: Optional[str] = None
    opening_period: Optional[str] = None
    accounting_year: Optional[str] = None

class CompanyResponse(BaseModel):
    id: int
    name: str
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    pincode: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    website: Optional[str]
    gstin: Optional[str]
    pan: Optional[str]
    business_type: Optional[str]
    opening_period: Optional[str]
    accounting_year: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[CompanyResponse])
async def get_companies(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Company))
    companies = result.scalars().all()
    return companies

@router.post("/", response_model=CompanyResponse)
async def create_company(
    company_data: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    company = Company(**company_data.dict())
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company

@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company

@router.put("/{company_id}", response_model=CompanyResponse)
async def update_company(
    company_id: int,
    company_data: CompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    for key, value in company_data.dict().items():
        setattr(company, key, value)
    
    company.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(company)
    return company

@router.delete("/{company_id}")
async def delete_company(
    company_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(select(Company).where(Company.id == company_id))
    company = result.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    await db.delete(company)
    await db.commit()
    return {"message": "Company deleted successfully"}

