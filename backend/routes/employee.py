import os
import json
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from backend.models.employee import Employee
from backend.database import db
from backend.services.face_service import FaceService
from flask_jwt_extended import jwt_required

employee_bp = Blueprint('employee', __name__)

@employee_bp.route('/', methods=['GET'])
@jwt_required()
def get_employees():
    employees = Employee.query.all()
    return jsonify([e.to_dict() for e in employees]), 200

@employee_bp.route('/register', methods=['POST'])
@jwt_required()
def register_employee():
    if 'image' not in request.files:
        return jsonify({"msg": "No image uploaded"}), 400
    
    image = request.files['image']
    employee_id = request.form.get('employee_id')
    name = request.form.get('name')
    department = request.form.get('department')

    if not all([employee_id, name, department]):
        return jsonify({"msg": "Missing required fields"}), 400

    if Employee.query.filter_by(employee_id=employee_id).first():
        return jsonify({"msg": "Employee ID already exists"}), 400

    # Save image
    filename = secure_filename(f"{employee_id}_{image.filename}")
    upload_folder = current_app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    image_path = os.path.join(upload_folder, filename)
    image.save(image_path)

    # Generate Encoding
    encoding = FaceService.get_encoding_from_image(image_path)
    if encoding is None:
        os.remove(image_path)  # Cleanup
        return jsonify({"msg": "No face detected in the image. Please try another one."}), 400

    new_employee = Employee(
        employee_id=employee_id,
        name=name,
        department=department,
        image_path=image_path,
        encoding=json.dumps(encoding)
    )
    db.session.add(new_employee)
    db.session.commit()

    return jsonify({"msg": "Employee registered successfully", "employee": new_employee.to_dict()}), 201

@employee_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_employee(id):
    employee = Employee.query.get_or_404(id)
    
    # Delete image file
    if employee.image_path and os.path.exists(employee.image_path):
        os.remove(employee.image_path)
    
    db.session.delete(employee)
    db.session.commit()
    return jsonify({"msg": "Employee deleted successfully"}), 200

@employee_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_employee(id):
    employee = Employee.query.get_or_404(id)
    data = request.get_json()
    
    employee.name = data.get('name', employee.name)
    employee.department = data.get('department', employee.department)
    
    db.session.commit()
    return jsonify({"msg": "Employee updated successfully", "employee": employee.to_dict()}), 200
