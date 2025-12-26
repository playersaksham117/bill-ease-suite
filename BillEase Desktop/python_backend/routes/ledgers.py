"""Ledger routes"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from routes.auth import get_current_user

router = APIRouter()

@router.get("/")
async def get_ledgers(db: AsyncSession = Depends(get_db), current_user = Depends(get_current_user)):
    return {"message": "Ledgers endpoint"}

