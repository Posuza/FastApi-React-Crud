from sqlalchemy import Column, Integer, String, inspect
from app.db.base import Base
from app.db.session import engine

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    description = Column(String(255), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description
        }

    @classmethod
    def create_table_if_not_exists(cls):
        inspector = inspect(engine)
        if not inspector.has_table(cls.__tablename__):
            Base.metadata.create_all(bind=engine, tables=[cls.__table__])
            print(f"Table {cls.__tablename__} created")
        else:
            print(f"Table {cls.__tablename__} already exists")