from sqlalchemy import Column, Integer, String, Boolean, inspect
from app.db.base import Base
from app.db.session import engine

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    is_active = Column(Boolean, default=True)

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