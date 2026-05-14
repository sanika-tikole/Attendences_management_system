from sqlalchemy import Column, Integer, String, Text

from ..database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(64), unique=True, nullable=False, index=True)
    name = Column(String(128), nullable=False)
    department = Column(String(128), nullable=False)
    image_path = Column(String(512), nullable=False)
    encoding = Column(Text, nullable=False)
