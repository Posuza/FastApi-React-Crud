from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import uuid
from app.core.oauth import oauth
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.token import Token
from app.models.user import User
from app.api.dependencies import security

router = APIRouter(prefix="/auth", tags=["social-auth"])

@router.get('/google/login')
async def google_login(request: Request):
    """Initiate Google OAuth flow"""
    redirect_uri = request.url_for('auth_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/google/callback')
async def auth_google(request: Request, db: Session = Depends(get_db)):
    """Handle Google OAuth callback"""
    token = await oauth.google.authorize_access_token(request)
    user_data = await oauth.google.parse_id_token(request, token)
    
    return await handle_oauth_login(db, {
        'email': user_data.email,
        'username': user_data.email.split('@')[0]
    })

@router.get('/github/login')
async def github_login(request: Request):
    """Initiate GitHub OAuth flow"""
    redirect_uri = request.url_for('auth_github')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get('/github/callback')
async def auth_github(request: Request, db: Session = Depends(get_db)):
    """Handle GitHub OAuth callback"""
    token = await oauth.github.authorize_access_token(request)
    resp = await oauth.github.get('user', token=token)
    user_data = resp.json()
    
    return await handle_oauth_login(db, {
        'email': user_data['email'],
        'username': user_data['login']
    })

# Update OAuth handlers to use JWT Bearer tokens
async def handle_oauth_login(db: Session, user_data: dict):
    """Helper function to handle OAuth user creation and token generation"""
    user = db.query(User).filter(User.email == user_data['email']).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            email=user_data['email'],
            username=user_data['username'],
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    access_token = create_access_token(data={"sub": user.username})
    expires_at = datetime.utcnow() + timedelta(minutes=30)
    
    db_token = Token(
        id=str(uuid.uuid4()),
        token=access_token,
        user_id=user.id,
        expires_at=expires_at
    )
    db.add(db_token)
    db.commit()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.to_dict()
    }