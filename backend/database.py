import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

# Получаем URL базы данных из переменных окружения или используем значение по умолчанию
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:0000@localhost/car_marketplace")
DEFAULT_DB_URL = "postgresql://postgres:0000@localhost/postgres"  # Используем стандартную БД postgres для подключения
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def create_database():
    """
    Создает базу данных car_marketplace, если она не существует
    """
    print("Проверяем наличие базы данных...")
    
    # Подключаемся к стандартной БД postgres
    engine = create_engine(DEFAULT_DB_URL)
    
    try:
        with engine.connect() as conn:
            # Проверяем существование БД
            result = conn.execute(text(
                "SELECT 1 FROM pg_database WHERE datname = 'car_marketplace'"
            ))
            
            # Если БД не существует, создаем её
            if not result.fetchone():
                print("База данных 'car_marketplace' не найдена, создаем...")
                # Отключаем другие соединения к БД, которые могут блокировать создание
                conn.execute(text("COMMIT"))
                conn.execute(text(
                    "CREATE DATABASE car_marketplace"
                ))
                print("База данных 'car_marketplace' успешно создана!")
            else:
                print("База данных 'car_marketplace' уже существует.")
                
    except Exception as e:
        print(f"Ошибка при создании базы данных: {e}")
        return False
        
    return True

def initialize_tables():
    """
    Создает таблицы в базе данных
    """
    try:
        from database import Base, engine 
        import models  # Импортируем модели, чтобы они зарегистрировались в Base.metadata
        
        print("Создаем таблицы...")
        Base.metadata.create_all(bind=engine)
        print("Таблицы успешно созданы!")
        
        # Проверяем создание таблиц
        tables = engine.table_names()
        print(f"Созданные таблицы: {', '.join(tables)}")
        
        return True
    except Exception as e:
        print(f"Ошибка при создании таблиц: {e}")
        return False

def create_admin_user():
    """
    Создает администратора, если пользователей нет
    """
    try:
        from database import SessionLocal
        import models
        from auth import get_password_hash
        
        db = SessionLocal()
        
        # Проверяем, есть ли пользователи
        user_count = db.query(models.User).count()
        
        if user_count == 0:
            print("Пользователей не найдено, создаем администратора...")
            
            # Создаем админа
            admin = models.User(
                username="admin",
                email="admin@example.com",
                hashed_password=get_password_hash("admin"),
                first_name="Admin",
                last_name="User",
                role="admin"
            )
            
            db.add(admin)
            db.commit()
            print("Администратор успешно создан!")
            print("Логин: admin")
            print("Пароль: admin")
        else:
            print(f"В системе уже есть {user_count} пользователей.")
            
        db.close()
        return True
    except Exception as e:
        print(f"Ошибка при создании администратора: {e}")
        return False
    
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

if __name__ == "__main__":
    print("=== Инициализация базы данных ===")
    
    if create_database():
        if initialize_tables():
            create_admin_user()
    
    print("=== Инициализация завершена ===")