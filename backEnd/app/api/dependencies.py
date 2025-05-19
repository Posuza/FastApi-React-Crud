from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Tuple
from datetime import datetime
from app.db.session import get_db
from app.models.token import Token
from app.models.user import User
from app.core.security import verify_token

# Create HTTPBearer instance for token authentication
security = HTTPBearer(
    scheme_name="Bearer",
    description="Enter your JWT token",
    auto_error=True
)

async def verify_token_db(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Tuple[Token, User]:
    """Verify token and return both token and associated user"""
    token = credentials.credentials
    
    # Check database token
    db_token = db.query(Token).filter(Token.token == token).first()
    if not db_token or db_token.is_revoked or db_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify JWT payload
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Get user
    user = db.query(User).filter(User.id == db_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return db_token, user

async def get_current_user(
    token_data: Tuple[Token, User] = Depends(verify_token_db)
) -> User:
    """Get current user from verified token"""
    _, user = token_data
    return user