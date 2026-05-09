import face_recognition
import cv2
import numpy as np
import base64
import json
import os

class FaceService:
    @staticmethod
    def get_encoding_from_image(image_path):
        """Generates face encoding from an image file path."""
        image = face_recognition.load_image_file(image_path)
        encodings = face_recognition.face_encodings(image)
        if len(encodings) > 0:
            return encodings[0].tolist()
        return None

    @staticmethod
    def base64_to_image(base64_string):
        """Converts base64 string to OpenCV image."""
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]
        
        img_data = base64.b64decode(base64_string)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img

    @staticmethod
    def process_frame(frame, known_encodings, known_names, tolerance=0.5):
        """
        Processes a single frame for face recognition.
        - frame: OpenCV image
        - known_encodings: List of numpy arrays
        - known_names: List of names corresponding to encodings
        - tolerance: Distance threshold for matching
        """
        # Resize frame for faster processing (1/4 size)
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        
        # Convert BGR (OpenCV) to RGB (face_recognition)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # Find all faces and encodings in the current frame
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        face_landmarks_list = face_recognition.face_landmarks(rgb_small_frame, face_locations)

        face_results = []
        
        for i, (face_encoding, face_location) in enumerate(zip(face_encodings, face_locations)):
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_encodings, face_encoding, tolerance=tolerance)
            name = "Unknown"
            employee_id = None
            distance = 1.0

            # Use Euclidean distance to find the best match
            face_distances = face_recognition.face_distance(known_encodings, face_encoding)
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_names[best_match_index]['name']
                    employee_id = known_names[best_match_index]['employee_id']
                    distance = float(face_distances[best_match_index])

            # Scale back up face locations
            top, right, bottom, left = face_location
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Scale up landmarks as well
            landmarks = {}
            if i < len(face_landmarks_list):
                for feature, points in face_landmarks_list[i].items():
                    landmarks[feature] = [(p[0] * 4, p[1] * 4) for p in points]

            face_results.append({
                "name": name,
                "employee_id": employee_id,
                "distance": distance,
                "box": {"top": top, "right": right, "bottom": bottom, "left": left},
                "landmarks": landmarks
            })

        return face_results
