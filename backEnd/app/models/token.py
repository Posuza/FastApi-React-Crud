from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, inspect
from sqlalchemy.orm import relationship, Session
from datetime import datetime
from app.db.base_class import Base
from app.db.session import engine

class Token(Base):
    __tablename__ = "tokens"

    id = Column(String(100), primary_key=True, index=True)
    token = Column(String(500), unique=True, index=True)
    user_id = Column(String(100), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    is_revoked = Column(Boolean, default=False)
    
    # Add relationship to User model
    user = relationship("User", back_populates="tokens")

    @classmethod
    def create_table_if_not_exists(cls):
        inspector = inspect(engine)
        if not inspector.has_table(cls.__tablename__):
            Base.metadata.create_all(bind=engine, tables=[cls.__table__])
            print(f"Table {cls.__tablename__} created")
        else:
            print(f"Table {cls.__tablename__} already exists")

    @classmethod
    def cleanup_tokens(cls, db: Session):
        """Remove expired and revoked tokens from the database"""
        try:
            deleted = db.query(cls).filter(
                (cls.expires_at < datetime.utcnow()) | 
                (cls.is_revoked == True)
            ).delete()
            db.commit()
            print(f"Cleaned up {deleted} tokens")
        except Exception as e:
            db.rollback()
            print(f"Error cleaning up tokens: {e}")