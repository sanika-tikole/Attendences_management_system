import json
import numpy as np
from datetime import datetime
from flask import Blueprint, request, jsonify
from backend.models.employee import Employee
from backend.models.attendance import Attendance
from backend.database import db
from backend.services.face_service import FaceService
from flask_jwt_extended import jwt_required

recognition_bp = Blueprint('recognition', __name__)

@recognition_bp.route('/process_frame', methods=['POST'])
@jwt_required()
def process_frame():
    data = request.get_json()
    frame_b64 = data.get('frame')
    
    if not frame_b64:
        return jsonify({"msg": "No frame provided"}), 400

    # Get all registered employees for comparison
    # Optimization: In a real production system, you might cache these encodings in memory (Redis or local dict)
    employees = Employee.query.all()
    if not employees:
        return jsonify({"results": []}), 200

    known_encodings = []
    known_names = []
    for emp in employees:
        known_encodings.append(np.array(json.loads(emp.encoding)))
        known_names.append({"name": emp.name, "employee_id": emp.employee_id})

    # Convert base64 to OpenCV image
    frame = FaceService.base64_to_image(frame_b64)
    
    # Process frame
    results = FaceService.process_frame(frame, known_encodings, known_names)

    # Auto-mark attendance for recognized faces
    marked_attendance = []
    now = datetime.now()
    today_date = now.date()
    current_time = now.time()

    for res in results:
        if res['name'] != "Unknown" and res['employee_id']:
            # Check if already marked for today
            existing = Attendance.query.filter_by(
                employee_id=res['employee_id'], 
                date=today_date
            ).first()

            if not existing:
                new_attendance = Attendance(
                    employee_id=res['employee_id'],
                    name=res['name'],
                    date=today_date,
                    time=current_time,
                    status='Present'
                )
                db.session.add(new_attendance)
                marked_attendance.append({
                    "employee_id": res['employee_id'],
                    "name": res['name'],
                    "time": current_time.strftime('%H:%M:%S')
                })
    
    if marked_attendance:
        db.session.commit()

    return jsonify({
        "results": results,
        "marked": marked_attendance
    }), 200

@recognition_bp.route('/history', methods=['GET'])
@jwt_required()
def get_attendance_history():
    # Basic history fetch
    attendance = Attendance.query.order_by(Attendance.date.desc(), Attendance.time.desc()).all()
    return jsonify([a.to_dict() for a in attendance]), 200

@recognition_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    # Simple stats for dashboard
    total_employees = Employee.query.count()
    today_date = datetime.now().date()
    today_attendance = Attendance.query.filter_by(date=today_date).count()
    
    # Get recent 5 records
    recent = Attendance.query.order_by(Attendance.date.desc(), Attendance.time.desc()).limit(5).all()
    
    return jsonify({
        "total_employees": total_employees,
        "today_attendance": today_attendance,
        "recent_records": [r.to_dict() for r in recent]
    }), 200
