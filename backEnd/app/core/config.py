import os
from typing import Any, Dict, Optional, List
from dotenv import load_dotenv
from pydantic import BaseSettings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from functools import lru_cache

# Load environment variables from root directory
load_dotenv(dotenv_path="../.env")

class Settings(BaseSettings):
    # Project settings
    PROJECT_NAME: str = "GutsAPI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    # Database settings
    DATABASE_URL: str
    MYSQL_ROOT_PASSWORD: Optional[str] = None
    MYSQL_DATABASE: Optional[str] = None
    MYSQL_USER: Optional[str] = None
    MYSQL_PASSWORD: Optional[str] = None
    
    # Security settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    MIN_PASSWORD_LENGTH: int = 8
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]
    
    # OAuth2 / Social Authentication Settings
    # Google OAuth2
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    
    # GitHub OAuth2
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/github/callback"
    
    # Facebook OAuth2
    FACEBOOK_CLIENT_ID: Optional[str] = None
    FACEBOOK_CLIENT_SECRET: Optional[str] = None
    FACEBOOK_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/facebook/callback"
    
    # Twitter OAuth2
    TWITTER_CLIENT_ID: Optional[str] = None
    TWITTER_CLIENT_SECRET: Optional[str] = None
    TWITTER_REDIRECT_URI: str
    
    model_config = {
        "env_file": "../.env",  # Look for .env in parent directory
        "case_sensitive": True,
        "extra": "ignore"  # This allows extra fields in .env file
    }

# Create settings instance
settings = Settings()

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