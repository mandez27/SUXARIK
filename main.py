from contextlib import asynccontextmanager
from fastapi import FastAPI
import database

# Явно импортируем Base и саму модель, чтобы SQLAlchemy её "увидела" при старте
from RegistrService.Models import Base, NewUserModel
import RegistrService.Registration
import RegistrService.GetUser

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Этот блок принудительно создаст таблицы со ВСЕМИ колонками при старте
    async with database.engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

# Подключаем роутер регистрации
app.include_router(RegistrService.Registration.router)

app.include_router(RegistrService.GetUser.router)
