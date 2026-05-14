from flask import Blueprint, request
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..services.attendance_service import list_attendance
from ..utils.response import success

attendance_bp = Blueprint("attendance_bp", __name__, url_prefix="/api/attendance")


@attendance_bp.route("", methods=["GET"])
def get_attendance():
    db: Session = SessionLocal()
    try:
        limit = int(request.args.get("limit", "200"))
        rows = list_attendance(db, limit)
        data = [
            {
                "id": row.id,
                "employee_id": row.employee_id,
                "employee_name": row.employee_name,
                "date": row.date.isoformat(),
                "timestamp": row.timestamp.isoformat() if row.timestamp else None,
                "status": row.status,
            }
            for row in rows
        ]
        return success(data, "Attendance list")
    finally:
        db.close()
