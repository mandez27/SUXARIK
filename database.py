import os
from typing import Any, AsyncGenerator

import RegistrService.Models
from pydantic import BaseModel, EmailStr
from sqlalchemy import String, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

USERS_DB_PATH = os.path.join(BASE_DIR, "RegistrService", "users.db").replace("\\", "/")
STUDENTS_DB_PATH = os.path.join(BASE_DIR, "RegistrService", "students.db").replace("\\", "/")

# Для работы с users.db
engine = create_async_engine(f"sqlite+aiosqlite:///{USERS_DB_PATH}")
new_session = async_sessionmaker(engine, expire_on_commit=False)

# Для работы с students.db (если потребуется отдельный сессионмейкер)
students_engine = create_async_engine(f"sqlite+aiosqlite:///{STUDENTS_DB_PATH}")
students_session = async_sessionmaker(students_engine, expire_on_commit=False)


async def get_session() -> AsyncGenerator[AsyncSession, Any]:
    async with new_session() as session:
        yield session
