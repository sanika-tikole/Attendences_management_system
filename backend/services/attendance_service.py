from datetime import date

from sqlalchemy.orm import Session

from ..models.attendance import Attendance


def mark_attendance(db: Session, employee_id: str, employee_name: str, status: str = "present") -> Attendance:
    today = date.today()

    existing = (
        db.query(Attendance)
        .filter(Attendance.employee_id == employee_id, Attendance.date == today)
        .first()
    )
    if existing:
        return existing

    record = Attendance(
        employee_id=employee_id,
        employee_name=employee_name,
        date=today,
        status=status,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_attendance(db: Session, limit: int = 200):
    return (
        db.query(Attendance)
        .order_by(Attendance.timestamp.desc())
        .limit(limit)
        .all()
    )
