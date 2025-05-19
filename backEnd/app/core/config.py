from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # Project settings
    PROJECT_NAME: str = "GutsAPI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    # Database settings
    DATABASE_URL: str
    DB_POOL_SIZE: int = 5
    
    # Security settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    MIN_PASSWORD_LENGTH: int = 8  # Added this line
    
    # OAuth2 settings
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
        "extra": "ignore"  # This allows extra fields in .env file
    }

settings = Settings()