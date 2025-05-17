from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.core.oauth import oauth
from app.db.session import get_db  # Change this import
from app.models.user import User  # Change this import
from app.schemas.token import Token

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.get('/login/google')
async def google_login(request: Request):
    redirect_uri = request.url_for('auth_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/google')
async def auth_google(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_data = await oauth.google.parse_id_token(request, token)
    
    # Check if user exists, if not create new user
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        user = User(
            email=user_data.email,
            username=user_data.email.split('@')[0],
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return {"access_token": token.get('access_token'), "user": user.to_dict()}

@router.get('/login/github')
async def github_login(request: Request):
    redirect_uri = request.url_for('auth_github')
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get('/github')
async def auth_github(request: Request, db: Session = Depends(get_db)):
    token = await oauth.github.authorize_access_token(request)
    resp = await oauth.github.get('user', token=token)
    user_data = resp.json()
    
    # Check if user exists, if not create new user
    user = db.query(User).filter(User.email == user_data['email']).first()
    if not user:
        user = User(
            email=user_data['email'],
            username=user_data['login'],
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return {"access_token": token['access_token'], "user": user.to_dict()}