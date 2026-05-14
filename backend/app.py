from flask import Flask, send_from_directory
from flask_cors import CORS

from .config import Config, ensure_directories
from .database import init_db
from .routes.attendance_routes import attendance_bp
from .routes.employee_routes import employee_bp
from .routes.health_routes import health_bp
from .routes.recognition_routes import recognition_bp
from .utils.logger import get_logger

logger = get_logger("backend.app")


def create_app() -> Flask:
    ensure_directories()
    init_db()

    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(employee_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(recognition_bp)

    @app.route("/uploads/<path:filename>", methods=["GET"])
    def get_uploaded_file(filename: str):
        return send_from_directory(Config.UPLOAD_DIR, filename)

    return app


app = create_app()


if __name__ == "__main__":
    logger.info("Starting face recognition attendance backend")
    app.run(host="0.0.0.0", port=5000, debug=True)
