from flask import Blueprint, request
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..services.employee_service import list_employees, register_employee
from ..utils.response import fail, success
from ..utils.validators import validate_employee_payload

employee_bp = Blueprint("employee_bp", __name__, url_prefix="/api/employees")


@employee_bp.route("", methods=["POST"])
def create_employee():
    db: Session = SessionLocal()
    try:
        employee_id = request.form.get("employee_id", "")
        name = request.form.get("name", "")
        department = request.form.get("department", "")
        image = request.files.get("image")

        errors = validate_employee_payload(name, employee_id, department, image)
        if errors:
            return fail("Validation failed", 422, errors)

        employee = register_employee(db, employee_id, name, department, image)
        return success(
            {
                "id": employee.id,
                "employee_id": employee.employee_id,
                "name": employee.name,
                "department": employee.department,
                "image_path": employee.image_path,
            },
            "Employee registered",
            201,
        )
    except ValueError as exc:
        return fail(str(exc), 400)
    except Exception:
        return fail("Unexpected server error", 500)
    finally:
        db.close()


@employee_bp.route("", methods=["GET"])
def get_employees():
    db: Session = SessionLocal()
    try:
        rows = list_employees(db)
        data = [
            {
                "id": row.id,
                "employee_id": row.employee_id,
                "name": row.name,
                "department": row.department,
                "image_path": row.image_path,
            }
            for row in rows
        ]
        return success(data, "Employee list")
    finally:
        db.close()
