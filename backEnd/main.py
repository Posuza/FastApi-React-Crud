from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import items, users, auth
from app.models import User, Item, Token  # Import all models
from app.db.base_class import Base
from app.db.session import engine, SessionLocal

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def init_db():
    try:
        # Create all tables
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Initialize database session
        db = SessionLocal()
        try:
            # Verify specific tables
            print("Verifying individual tables...")
            User.create_table_if_not_exists()
            Item.create_table_if_not_exists()
            Token.create_table_if_not_exists()
            
            print("Database initialization completed successfully")
        finally:
            db.close()
    except Exception as e:
        print(f"Error during database initialization: {e}")
        raise e

# Include API routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(items.router, prefix=settings.API_V1_STR)