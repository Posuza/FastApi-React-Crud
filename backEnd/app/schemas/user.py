from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional
import re

class UserBase(BaseModel):
    """Base schema for user data"""
    username: str = Field(
        ..., 
        min_length=3, 
        max_length=50,
        description="Username must be between 3 and 50 characters"
    )
    email: EmailStr = Field(
        ...,
        description="Valid email address"
    )

    @validator('username')
    def username_alphanumeric(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Username must be alphanumeric, and may include _ and -')
        return v.lower()  # Store usernames in lowercase

class UserCreate(UserBase):
    """Schema for user creation"""
    password: str = Field(
        ..., 
        min_length=8,
        description="Password must be at least 8 characters long"
    )

    @validator('password')
    def password_complexity(cls, v):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$', v):
            raise ValueError(
                'Password must contain at least one letter, one number, '
                'and be at least 8 characters long'
            )
        return v

class UserLogin(BaseModel):
    """Schema for user login"""
    login: str = Field(..., description="Username or email")
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    """Schema for user updates"""
    username: Optional[str] = Field(
        None, 
        min_length=3, 
        max_length=50,
        description="Username must be between 3 and 50 characters"
    )
    email: Optional[EmailStr] = Field(
        None,
        description="Valid email address"
    )
    password: Optional[str] = Field(
        None,
        min_length=8,
        description="New password"
    )

    @validator('username')
    def username_update_validator(cls, v):
        if v is not None:
            if not re.match(r'^[a-zA-Z0-9_-]+$', v):
                raise ValueError('Username must be alphanumeric, and may include _ and -')
            return v.lower()
        return v

    @validator('password')
    def password_update_validator(cls, v):
        if v is not None:
            if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$', v):
                raise ValueError(
                    'Password must contain at least one letter, one number, '
                    'and be at least 8 characters long'
                )
        return v

class UserResponse(BaseModel):
    """Schema for user responses"""
    id: str
    username: str
    email: EmailStr
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    """Schema for token responses"""
    access_token: str
    token_type: str
    expires_at: str
    user: UserResponse