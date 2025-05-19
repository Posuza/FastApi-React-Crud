from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Tuple
from datetime import datetime, timedelta
import uuid

from app.schemas.user import UserCreate, UserResponse, UserLogin, UserUpdate
from app.models.user import User
from app.models.token import Token
from app.db.session import get_db
from app.core.security import get_password_hash, create_access_token, authenticate_user
from app.api.dependencies import verify_token_db

router = APIRouter(prefix="/users", tags=["users"])

@router.post(
    "/register", 
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"description": "Username or email already exists"},
        422: {"description": "Validation error"}
    }
)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create new user with the following requirements:
    - Username: 3-50 characters, alphanumeric with _ and -
    - Email: Valid email format
    - Password: Minimum 8 characters, at least one letter and one number
    """
    try:
        # Check existing user
        existing = db.query(User).filter(
            or_(User.email == user.email.lower(),
                User.username == user.username.lower())
        ).first()

        if existing:
            if existing.email == user.email.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = User(
            id=str(uuid.uuid4()),
            username=user.username.lower(),
            email=user.email.lower(),
            password=hashed_password,
            is_active=True
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user.to_dict()

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

@router.post("/login", responses={401: {"description": "Invalid credentials"}})
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with username/email and password.
    Returns JWT token if credentials are valid.
    """
    try:
        user = authenticate_user(db, user_credentials.login.lower(), user_credentials.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_access_token(data={"sub": user.username})
        expires_at = datetime.utcnow() + timedelta(minutes=30)
        
        # Create new token
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
            "expires_at": expires_at.isoformat(),
            "user": user.to_dict()
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login error: {str(e)}"
        )

@router.get("/", response_model=List[UserResponse])
async def read_users(
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Get all users (requires authentication)"""
    try:
        users = db.query(User).filter(User.is_active == True).all()
        return [user.to_dict() for user in users]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching users: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def read_current_user(
    token_data: Tuple[Token, User] = Depends(verify_token_db)
):
    """Get current authenticated user's information"""
    _, user = token_data
    return user.to_dict()

@router.get("/{user_id}", response_model=UserResponse)
async def read_user(
    user_id: str,
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Get specific user by ID (requires authentication)"""
    try:
        user = db.query(User).filter(
            User.id == user_id,
            User.is_active == True
        ).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user.to_dict()
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user: {str(e)}"
        )

@router.post("/logout")
async def logout(
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Logout current user by revoking their token"""
    try:
        token, _ = token_data
        token.is_revoked = True
        db.commit()
        return {"message": "Successfully logged out"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during logout: {str(e)}"
        )

@router.post("/token/refresh")
async def refresh_token(
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Refresh token (requires authentication)"""
    try:
        old_token, user = token_data
        
        # First create new token
        new_access_token = create_access_token(data={"sub": user.username})
        expires_at = datetime.utcnow() + timedelta(minutes=30)
        
        # Create new token record in database
        new_db_token = Token(
            id=str(uuid.uuid4()),
            token=new_access_token,
            user_id=user.id,
            expires_at=expires_at,
            is_revoked=False
        )
        
        # Add new token and revoke old token
        db.add(new_db_token)
        old_token.is_revoked = True
        
        # Commit both changes in one transaction
        db.commit()
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_at": expires_at.isoformat(),
            "user": user.to_dict()  # Added user info in response
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error refreshing token: {str(e)}"
        )

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Update current user's information"""
    try:
        _, current_user = token_data
        
        # Check if username is being updated and if it's already taken
        if user_update.username and user_update.username != current_user.username:
            existing_user = db.query(User).filter(
                User.username == user_update.username.lower()
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )
            current_user.username = user_update.username.lower()

        # Check if email is being updated and if it's already taken
        if user_update.email and user_update.email != current_user.email:
            existing_user = db.query(User).filter(
                User.email == user_update.email.lower()
            ).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            current_user.email = user_update.email.lower()

        # Update password if provided
        if user_update.password:
            current_user.password = get_password_hash(user_update.password)

        try:
            db.commit()
            db.refresh(current_user)
            return current_user.to_dict()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating user: {str(e)}"
        )