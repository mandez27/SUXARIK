from pydantic import BaseModel, EmailStr
from datetime import date
from enum import Enum
from sqlalchemy import String, Date, Enum as SQLEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class GenderEnum(str, Enum):
    M = "M"
    FE = "Ж"

class Base(DeclarativeBase):
   pass


from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class NewUserModel(Base):
    __tablename__ = "users"

    # Первичный ключ (email)
    email: Mapped[str] = mapped_column(primary_key=True)
    password: Mapped[str]

    # Добавляем недостающие поля, из-за которых была ошибка TypeError
    fio: Mapped[str | None] = mapped_column(nullable=True)
    faculty: Mapped[str | None] = mapped_column(nullable=True)
    group: Mapped[str | None] = mapped_column(name="group",
                                              nullable=True)  # name="group" защищает от конфликтов с ключевым словом SQL

    # Дополнительные поля при регистрации
    gender: Mapped[str | None] = mapped_column(nullable=True)
    birthDate: Mapped[str | None] = mapped_column(nullable=True)


# 5. Валидация Pydantic
class UserCreate(BaseModel):
    email: str
    password: str
    birthDate: date
    gender: GenderEnum


