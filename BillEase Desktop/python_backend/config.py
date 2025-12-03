"""
Configuration for BillEase Suite Python Backend
Supports SQLite, MySQL, and PostgreSQL databases
"""
from pydantic_settings import BaseSettings
from typing import Literal
import os

class Settings(BaseSettings):
    # Application Settings
    app_name: str = "BillEase Suite Python Backend"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Server Settings
    host: str = "127.0.0.1"
    port: int = 8000
    
    # Database Settings
    database_type: Literal["sqlite", "mysql", "postgresql"] = "sqlite"
    
    # SQLite Settings
    sqlite_db_path: str = "billease.db"
    
    # MySQL Settings
    mysql_host: str = "localhost"
    mysql_port: int = 3306
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_database: str = "billease"
    
    # PostgreSQL Settings
    postgresql_host: str = "localhost"
    postgresql_port: int = 5432
    postgresql_user: str = "postgres"
    postgresql_password: str = ""
    postgresql_database: str = "billease"
    
    # Security Settings
    secret_key: str = os.getenv("SECRET_KEY", "billease-secret-key-change-in-production")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30 * 24 * 60  # 30 days
    
    # CORS Settings
    cors_origins: list = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()

def get_database_url() -> str:
    """Get database URL based on database type"""
    if settings.database_type == "sqlite":
        return f"sqlite+aiosqlite:///{settings.sqlite_db_path}"
    elif settings.database_type == "mysql":
        return f"mysql+pymysql://{settings.mysql_user}:{settings.mysql_password}@{settings.mysql_host}:{settings.mysql_port}/{settings.mysql_database}"
    elif settings.database_type == "postgresql":
        return f"postgresql+asyncpg://{settings.postgresql_user}:{settings.postgresql_password}@{settings.postgresql_host}:{settings.postgresql_port}/{settings.postgresql_database}"
    else:
        raise ValueError(f"Unsupported database type: {settings.database_type}")

