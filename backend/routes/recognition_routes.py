from flask import Blueprint, Response, request
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..services.recognition_service import match_face_from_image_bytes, stream_recognition_frames
from ..utils.response import fail, success

recognition_bp = Blueprint("recognition_bp", __name__, url_prefix="/api/recognition")


@recognition_bp.route("/match", methods=["POST"])
def match_face():
    db: Session = SessionLocal()
    try:
        image = request.files.get("image")
        if image is None:
            return fail("Image file is required.", 422)

        result = match_face_from_image_bytes(db, image.read())
        return success(result, "Recognition completed")
    finally:
        db.close()


@recognition_bp.route("/stream", methods=["GET"])
def stream_face_recognition():
    try:
        return Response(
            stream_recognition_frames(SessionLocal),
            mimetype="multipart/x-mixed-replace; boundary=frame",
        )
    except RuntimeError as exc:
        return fail(str(exc), 500)
