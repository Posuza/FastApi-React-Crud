from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.api.endpoints import items, users, auth
from app.core.config import settings
from app.schemas.user import (
    UserBase,  # Add this import
    UserCreate, 
    UserResponse, 
    UserLogin, 
    UserUpdate, 
    TokenResponse
)
from app.schemas.item import ItemCreate, ItemResponse

app = FastAPI(
    title="GutsAPI",
    description="API for Guts application",
    version="1.0.0",
    openapi_url="/openapi.json",  # Explicitly set OpenAPI URL
    docs_url="/docs",            # Explicitly set Swagger UI URL
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="GutsAPI",
        version="1.0.0",
        description="API for Guts application",
        routes=app.routes,
    )

    # Configure components including schemas
    openapi_schema["components"] = {
        "securitySchemes": {
            "Bearer": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
                "description": "Enter JWT token"
            }
        },
        "schemas": {
            # User schemas
            "UserCreate": UserCreate.model_json_schema(),
            "UserLogin": UserLogin.model_json_schema(),
            "UserUpdate": UserUpdate.model_json_schema(),
            "UserResponse": UserResponse.model_json_schema(),
            "TokenResponse": TokenResponse.model_json_schema(),
            # Item schemas
            "ItemCreate": ItemCreate.model_json_schema(),
            "ItemResponse": ItemResponse.model_json_schema(),
            # Error schemas
            "HTTPValidationError": {
                "title": "HTTPValidationError",
                "type": "object",
                "properties": {
                    "detail": {
                        "title": "Detail",
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/ValidationError"
                        }
                    }
                }
            },
            "ValidationError": {
                "title": "ValidationError",
                "type": "object",
                "properties": {
                    "loc": {
                        "title": "Location",
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "msg": {"title": "Message", "type": "string"},
                    "type": {"title": "Error Type", "type": "string"}
                },
                "required": ["loc", "msg", "type"]
            }
        }
    }

    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Set custom OpenAPI schema
app.openapi = custom_openapi

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(items.router, prefix=settings.API_V1_STR)