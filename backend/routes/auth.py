from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from backend.models.admin import Admin
from backend.database import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    admin = Admin.query.filter_by(email=email).first()

    if admin and admin.check_password(password):
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token), 200
    
    return jsonify({"msg": "Bad email or password"}), 401

@auth_bp.route('/register_admin', methods=['POST'])
def register_admin():
    # Only for initial setup or internal use
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if Admin.query.filter_by(email=email).first():
        return jsonify({"msg": "Admin already exists"}), 400

    new_admin = Admin(email=email)
    new_admin.set_password(password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"msg": "Admin created successfully"}), 201
