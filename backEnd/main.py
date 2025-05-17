from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.core.config import settings, init_db
from app.models.item import Item
from app.models.user import User
from app.api.endpoints import items, users, auth

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Update to match config.py CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # Use settings instead of hardcoded value
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Add session middleware for OAuth
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY
)

# Create tables on startup
@app.on_event("startup")
async def startup_event():
    try:
        init_db()
        Item.create_table_if_not_exists()
        User.create_table_if_not_exists()
        print("Database initialization completed.")
    except Exception as e:
        print(f"Startup error: {str(e)}")
        raise

# Include routers
app.include_router(items.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(auth.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {"message": "Welcome to GutsAPI"}