from typing import Union, List, Optional
from fastapi import FastAPI, Depends, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel

from utilities.dbConfig import get_db, engine
from utilities.models import Base, Item, User
from utilities.schemas import ItemResponse, ItemCreate, UserResponse, UserCreate

app = FastAPI()

# Add CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Create tables
@app.on_event("startup")
def on_startup():
    Item.create_table_if_not_exists()
    User.create_table_if_not_exists()
    print("Database initialization completed.")

@app.get("/")
def read_root():
    return {"data": "hello"}

@app.get("/items/", response_model=List[ItemResponse])
def read_all_items(db: Session = Depends(get_db)):
    items = db.query(Item).all()
    return [item.to_dict() for item in items]

@app.get("/items/{item_id}", response_model=ItemResponse)
def read_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item.to_dict()

@app.post("/items/", response_model=ItemResponse)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    new_item = Item(name=item.name, description=item.description)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item.to_dict()

@app.put("/items/{item_id}", response_model=ItemResponse)
async def update_item(item_id: int, item: ItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update the item attributes
    db_item.name = item.name
    db_item.description = item.description
    
    try:
        db.commit()
        db.refresh(db_item)
        return db_item.to_dict()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))



##################### item ###########################


@app.delete("/items/{item_id}", response_model=dict)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    try:
        item = db.query(Item).filter(Item.id == item_id).first()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Store item data before deletion for response
        item_data = item.to_dict()
        
        # Delete the item
        db.delete(item)
        db.commit()
        
        return {"message": "Item deleted successfully", "item": item_data}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete item: {str(e)}"
        )




########################## user ###########################

# Add user routes
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        username=user.username,
        email=user.email,
        password=user.password  # In production, hash this password!
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user.to_dict()

@app.get("/users/", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [user.to_dict() for user in users]

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

active_sessions = set()  # In production, use a database or Redis

@app.post("/users/login")
def login_user(username: str, password: str, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user or user.password != password:
            raise HTTPException(
                status_code=401,
                detail="Incorrect username or password"
            )
        
        # Add user to active sessions
        active_sessions.add(username)
        
        return {
            "message": "Login successful",
            "user": user.to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class LogoutRequest(BaseModel):
    username: str

@app.post("/users/logout")
def logout_user(request: LogoutRequest):
    try:
        if request.username in active_sessions:
            active_sessions.remove(request.username)
            return {"message": "Logout successful"}
        else:
            raise HTTPException(
                status_code=401,
                detail="User not logged in"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Logout failed: {str(e)}"
        )

@app.get("/users/session-status/{username}")
def check_session(username: str):
    return {
        "is_active": username in active_sessions
    }

@app.delete("/users/{user_id}", response_model=dict)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Store user data before deletion for response
        user_data = user.to_dict()
        
        # Delete the user
        db.delete(user)
        db.commit()
        
        return {
            "message": "User deleted successfully",
            "user": user_data
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete user: {str(e)}"
        )