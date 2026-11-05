from unittest import result

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from RegistrService.Models import NewUserModel


router = APIRouter(prefix="/GetInfo", tags=["Get Info"])


@router.get("/GetUser")
async def get_user(db: AsyncSession = Depends(get_session)):
    query = select(NewUserModel)
    result = await db.execute(query)
    user = result.scalars().all()

    return user

