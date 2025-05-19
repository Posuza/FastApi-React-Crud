import os
from typing import Any, Dict, Optional, List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from functools import lru_cache

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    # Project settings
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "GutsAPI")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mysql+mysqlconnector://root:@localhost:3306/product")
    
    # OAuth2 settings
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET")
    GITHUB_CLIENT_ID: Optional[str] = os.getenv("GITHUB_CLIENT_ID")
    GITHUB_CLIENT_SECRET: Optional[str] = os.getenv("GITHUB_CLIENT_SECRET")
    
    # Security settings
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://localhost:8080").split(",")
    
    # JWT Settings
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")

    # API Settings
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")

    # Database pool settings
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "5"))
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "10"))
    DB_POOL_RECYCLE: int = int(os.getenv("DB_POOL_RECYCLE", "3600"))
    DB_ECHO: bool = os.getenv("DB_ECHO", "False").lower() == "true"

    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Cache and return settings instance"""
    return Settings()

settings = get_settings()

# Database configuration
DATABASE_CONFIG: Dict[str, Any] = {
    "echo": settings.DB_ECHO,
    "pool_pre_ping": True,
    "pool_recycle": settings.DB_POOL_RECYCLE,
    "pool_size": settings.DB_POOL_SIZE,
    "max_overflow": settings.DB_MAX_OVERFLOW,
}

# Database configuration and initialization
def init_db():
    if not settings.DATABASE_URL:
        raise ValueError("No DATABASE_URL set in environment")
    try:
        # Test database connection
        engine.connect()
        print("Database connection successful")
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        raise

# Create engine with specific MySQL settings
engine = create_engine(
    settings.DATABASE_URL,
    **DATABASE_CONFIG
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()