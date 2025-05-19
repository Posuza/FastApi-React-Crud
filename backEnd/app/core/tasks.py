from sqlalchemy.orm import Session
from app.models.token import Token
from datetime import datetime

def cleanup_expired_tokens(db: Session):
    """Remove expired and revoked tokens from the database"""
    db.query(Token).filter(
        (Token.expires_at < datetime.utcnow()) | (Token.is_revoked == True)
    ).delete()
    db.commit()