from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/users", tags=["users"])

active_sessions = set()  # In production, use Redis or database

@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user.to_dict()

@router.get("/", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [user.to_dict() for user in users]

@router.post("/login")
def login_user(username: str, password: str, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(status_code=401, detail="Incorrect username or password")
        
        # Create access token
        access_token = create_access_token(data={"sub": user.username})
        active_sessions.add(username)
        
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": user.to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class LogoutRequest(BaseModel):
    username: str

@router.post("/logout")
def logout_user(request: LogoutRequest):
    try:
        if request.username in active_sessions:
            active_sessions.remove(request.username)
            return {"message": "Logout successful"}
        raise HTTPException(status_code=401, detail="User not logged in")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")

@router.get("/session-status/{username}")
def check_session(username: str):
    return {"is_active": username in active_sessions}

@router.delete("/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user.to_dict()
        db.delete(user)
        db.commit()
        
        return {"message": "User deleted successfully", "user": user_data}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete user: {str(e)}")