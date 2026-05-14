import os
import uuid

from sqlalchemy.orm import Session

from ..config import Config
from ..models.employee import Employee
from ..utils.encoding_utils import (
    deserialize_encoding,
    get_first_face_encoding,
    load_image_array_from_bytes,
    serialize_encoding,
)


def register_employee(db: Session, employee_id: str, name: str, department: str, image_file):
    duplicate = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if duplicate:
        raise ValueError("Employee ID already exists.")

    ext = os.path.splitext(image_file.filename or "")[1] or ".jpg"
    filename = f"{employee_id}_{uuid.uuid4().hex}{ext}"
    abs_path = os.path.join(Config.UPLOAD_DIR, filename)
    rel_path = f"/uploads/{filename}"

    raw_bytes = image_file.read()
    image_file.stream.seek(0)

    image_array = load_image_array_from_bytes(raw_bytes)
    encoding = get_first_face_encoding(image_array)
    if encoding is None:
        raise ValueError("No face detected in uploaded image.")

    image_file.save(abs_path)

    employee = Employee(
        employee_id=employee_id,
        name=name,
        department=department,
        image_path=rel_path,
        encoding=serialize_encoding(encoding),
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


def list_employees(db: Session):
    return db.query(Employee).order_by(Employee.id.desc()).all()


def get_known_faces(db: Session):
    employees = db.query(Employee).all()
    encodings = [deserialize_encoding(employee.encoding) for employee in employees]
    return employees, encodings
