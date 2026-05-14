import json
from io import BytesIO

import face_recognition
import numpy as np
from PIL import Image


def load_image_array_from_bytes(data: bytes) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    return np.array(image)


def get_first_face_encoding(image_array: np.ndarray):
    encodings = face_recognition.face_encodings(image_array)
    if not encodings:
        return None
    return encodings[0]


def serialize_encoding(encoding: np.ndarray) -> str:
    return json.dumps(encoding.tolist())


def deserialize_encoding(raw: str) -> np.ndarray:
    return np.array(json.loads(raw), dtype=np.float64)
