from sqlalchemy import Column, Date, DateTime, Integer, String, func

from ..database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(64), nullable=False, index=True)
    employee_name = Column(String(128), nullable=False)
    date = Column(Date, nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    status = Column(String(32), nullable=False, default="present")
