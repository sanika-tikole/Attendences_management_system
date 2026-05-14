import cv2
import face_recognition
import numpy as np

from ..config import Config
from ..utils.encoding_utils import get_first_face_encoding, load_image_array_from_bytes


def match_face_from_image_bytes(db, image_bytes: bytes):
    from .attendance_service import mark_attendance
    from .employee_service import get_known_faces

    image_array = load_image_array_from_bytes(image_bytes)
    encoding = get_first_face_encoding(image_array)
    if encoding is None:
        return {"result": "no_face"}

    employees, known_encodings = get_known_faces(db)
    if not known_encodings:
        return {"result": "no_employees"}

    distances = face_recognition.face_distance(known_encodings, encoding)
    best_index = int(np.argmin(distances))
    best_distance = float(distances[best_index])

    if best_distance <= Config.FACE_MATCH_THRESHOLD:
        employee = employees[best_index]
        attendance = mark_attendance(db, employee.employee_id, employee.name, "present")
        return {
            "result": "matched",
            "distance": best_distance,
            "employee": {
                "id": employee.id,
                "employee_id": employee.employee_id,
                "name": employee.name,
                "department": employee.department,
            },
            "attendance": {
                "id": attendance.id,
                "date": attendance.date.isoformat(),
                "timestamp": attendance.timestamp.isoformat() if attendance.timestamp else None,
                "status": attendance.status,
            },
        }

    return {"result": "unknown", "distance": best_distance}


def stream_recognition_frames(db_factory):
    from .attendance_service import mark_attendance
    from .employee_service import get_known_faces

    camera = cv2.VideoCapture(Config.CAMERA_INDEX)
    if not camera.isOpened():
        raise RuntimeError("Unable to open webcam.")

    try:
        while True:
            ok, frame = camera.read()
            if not ok:
                break

            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            locations = face_recognition.face_locations(rgb_frame)
            encodings = face_recognition.face_encodings(rgb_frame, locations)

            db = db_factory()
            employees, known_encodings = get_known_faces(db)

            for (top, right, bottom, left), encoding in zip(locations, encodings):
                label = "Unknown"
                color = (0, 0, 255)

                if known_encodings:
                    distances = face_recognition.face_distance(known_encodings, encoding)
                    best_index = int(np.argmin(distances))
                    best_distance = float(distances[best_index])

                    if best_distance <= Config.FACE_MATCH_THRESHOLD:
                        employee = employees[best_index]
                        mark_attendance(db, employee.employee_id, employee.name, "present")
                        label = f"{employee.name} ({employee.employee_id})"
                        color = (0, 200, 0)

                cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
                cv2.rectangle(frame, (left, bottom - 30), (right, bottom), color, cv2.FILLED)
                cv2.putText(frame, label, (left + 6, bottom - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

            db.close()

            _, jpeg = cv2.imencode(".jpg", frame)
            payload = jpeg.tobytes()
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + payload + b"\r\n"
            )
    finally:
        camera.release()
