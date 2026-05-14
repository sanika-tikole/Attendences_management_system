from flask import Blueprint

from ..utils.response import success

health_bp = Blueprint("health_bp", __name__, url_prefix="/api")


@health_bp.route("/health", methods=["GET"])
def health():
    return success({"status": "ok"}, "Backend healthy")
