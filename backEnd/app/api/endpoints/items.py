from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Tuple
from app.schemas.item import ItemCreate, ItemResponse
from app.models.item import Item
from app.db.session import get_db
from app.api.dependencies import verify_token_db
from app.models.user import User
from app.models.token import Token

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/", response_model=List[ItemResponse])
async def read_all_items(
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Get all items (requires authentication)"""
    items = db.query(Item).all()
    return [item.to_dict() for item in items]

@router.get("/{item_id}", response_model=ItemResponse)
async def read_item(
    item_id: int,
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Get specific item (requires authentication)"""
    item = db.query(Item).filter(Item.id == item_id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item.to_dict()

@router.post("/", response_model=ItemResponse)
async def create_item(
    item: ItemCreate,
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Create new item (requires authentication)"""
    new_item = Item(name=item.name, description=item.description)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item.to_dict()

@router.put("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: int,
    item: ItemCreate,
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Update item (requires authentication)"""
    db_item = db.query(Item).filter(Item.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db_item.name = item.name
    db_item.description = item.description
    
    try:
        db.commit()
        db.refresh(db_item)
        return db_item.to_dict()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{item_id}")
async def delete_item(
    item_id: int,
    token_data: Tuple[Token, User] = Depends(verify_token_db),
    db: Session = Depends(get_db)
):
    """Delete item (requires authentication)"""
    try:
        item = db.query(Item).filter(Item.id == item_id).first()
        if item is None:
            raise HTTPException(status_code=404, detail="Item not found")
        
        db.delete(item)
        db.commit()
        return {"message": "Item deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete item: {str(e)}"
        )