from datetime import datetime, timedelta
from typing import Optional
from authlib.jose import jwt
from authlib.jose.errors import JoseError
from passlib.context import CryptContext
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models.user import User

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT token with proper header and claims"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "bearer"
    })
    
    # Using authlib.jose jwt encode
    return jwt.encode(
        {"alg": "HS256", "typ": "JWT"},
        to_encode,
        settings.SECRET_KEY
    ).decode()

def verify_token(token: str) -> Optional[dict]:
    try:
        # Using authlib.jose jwt decode
        claims = jwt.decode(token, settings.SECRET_KEY)
        claims.validate()  # Validate expiration and other claims
        return claims
    except JoseError:
        return None

def authenticate_user(db: Session, login: str, password: str) -> Optional[User]:
    """Authenticate a user with username/email and password"""
    # Try to find user by username or email
    user = db.query(User).filter(
        (User.username == login) | (User.email == login)
    ).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.password):
        return None
    
    return user