from flask import Blueprint, request, jsonify

auth_bp = Blueprint("auth_bp", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        req_data = request.get_json() or {}
        email = req_data.get("email", "")
        password = req_data.get("password", "")

        # Validate format or check defaults
        if not email or not password:
            return jsonify({
                "success": False,
                "message": "Email and password are required"
            }), 400

        # Mock Admin credentials
        # Allow any password >= 6 chars for convenience or standard "admin123"
        if email == "admin@company.com" and password == "admin123":
            user_data = {
                "email": "admin@company.com",
                "name": "System Administrator"
            }
            token = "mock-jwt-token-12345"

            # Support both unwrapped (token/user in root) and wrapped (in data key) shapes
            return jsonify({
                "success": True,
                "message": "Logged in successfully.",
                "token": token,
                "user": user_data,
                "data": {
                    "token": token,
                    "user": user_data
                }
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Invalid email or password. Use: admin@company.com / admin123"
            }), 401

    except Exception as exc:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(exc)}"
        }), 500

@auth_bp.route("/me", methods=["GET"])
def get_profile():
    # Mock authentic profile session
    user_data = {
        "email": "admin@company.com",
        "name": "System Administrator"
    }
    return jsonify({
        "success": True,
        "message": "Profile fetched successfully",
        "email": "admin@company.com",
        "name": "System Administrator",
        "data": user_data
    }), 200
