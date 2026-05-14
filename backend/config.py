import os


class Config:
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    DATABASE_DIR = os.path.join(BASE_DIR, "database")
    UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
    LOG_DIR = os.path.join(BASE_DIR, "logs")

    DB_FILE = os.path.join(DATABASE_DIR, "attendance.db")
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{DB_FILE}"

    FACE_MATCH_THRESHOLD = float(os.getenv("FACE_MATCH_THRESHOLD", "0.55"))
    CAMERA_INDEX = int(os.getenv("CAMERA_INDEX", "0"))


def ensure_directories() -> None:
    os.makedirs(Config.DATABASE_DIR, exist_ok=True)
    os.makedirs(Config.UPLOAD_DIR, exist_ok=True)
    os.makedirs(Config.LOG_DIR, exist_ok=True)
