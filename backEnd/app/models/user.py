from sqlalchemy import Column, Integer, String, Boolean, inspect
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from app.db.session import engine

class User(Base):
    __tablename__ = "users"

    id = Column(String(100), primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    is_active = Column(Boolean, default=True)
    
    # Add this line to establish bidirectional relationship
    tokens = relationship("Token", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "is_active": self.is_active
        }

    @classmethod
    def create_table_if_not_exists(cls):
        inspector = inspect(engine)
        if not inspector.has_table(cls.__tablename__):
            Base.metadata.create_all(bind=engine, tables=[cls.__table__])
            print(f"Table {cls.__tablename__} created")
        else:
            print(f"Table {cls.__tablename__} already exists")