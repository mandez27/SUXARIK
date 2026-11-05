import os
import aiosqlite
from fastapi import APIRouter, Depends, HTTPException, status
from pwdlib import PasswordHash
from sqlalchemy.ext.asyncio import AsyncSession
from RegistrService import Models
import database

router = APIRouter(prefix="/UserRegistration", tags=["User"])

# Создаем современный контекст хэширования (взамен passlib)
password_hash = PasswordHash.recommended()

# Автоматически определяем правильный путь к базе данных:
# Она лежит в той же папке, что и этот файл скрипта
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(CURRENT_DIR, "students.db")


# РУЧКА №1: Регистрация пользователя с проверкой в students.db
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(
        user_in: Models.UserCreate,
        session: AsyncSession = Depends(database.get_session)
):
    # 1. Проверяем, не зарегистрирован ли он УЖЕ в нашей новой системе final_users
    existing_user = await session.get(Models.NewUserModel, str(user_in.email))
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email уже зарегистрирован в системе"
        )

    # 2. АСИНХРОННО проверяем email в старой базе данных по точному пути DB_PATH
    student_fio = None
    student_faculty = None
    student_group = None

    try:
        async with aiosqlite.connect(DB_PATH) as db:
            async with db.execute(
                    'SELECT fio, faculty, "group" FROM students WHERE email = ?',
                    (str(user_in.email),)
            ) as cursor:
                student_data = await cursor.fetchone()

                if not student_data:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Данный email отсутствует в базе данных студентов. Регистрация запрещена."
                    )

                # Распаковываем данные из таблицы 'students'
                student_fio, student_faculty, student_group = student_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ошибка при обращении к верификационной базе: {str(e)}"
        )

    # 3. Формируем данные для новой модели
    user_data = user_in.model_dump()

    # Хэшируем пароль с помощью pwdlib
    user_data["password"] = password_hash.hash(user_in.password)

    # Обогащаем данными, полученными из students.db
    user_data["fio"] = student_fio
    user_data["faculty"] = student_faculty
    user_data["group"] = student_group

    # 4. Создаем пользователя в новой БД через SQLAlchemy
    new_user = Models.NewUserModel(**user_data)

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return {"status": "User created", "user_id": new_user.email}


