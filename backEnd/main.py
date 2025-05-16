from typing import Union, List
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from utilities.dbConfig import get_db, engine
from utilities.models import Base, Item
from utilities.schemas import ItemResponse, ItemCreate

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