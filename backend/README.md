# 🤖 AI Face Recognition Attendance System - Backend

This is the backend server for the AI Face Recognition Attendance System. It provides a robust REST API using **Python** and **Flask**, handles database interactions via **SQLAlchemy**, and performs real-time face detection and encoding using the **dlib** and **face_recognition** libraries.

## 🚀 Tech Stack

- **Framework**: [Flask](https://flask.palletsprojects.com/)
- **Database ORM**: [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)
- **Authentication**: [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- **Face Recognition**: [face_recognition](https://github.com/ageitgey/face_recognition), [OpenCV](https://opencv.org/)
- **Data Processing**: [NumPy](https://numpy.org/), [Pandas](https://pandas.pydata.org/)
- **CORS**: [Flask-CORS](https://flask-cors.readthedocs.io/)
- **Environment**: [python-dotenv](https://saurabh-kumar.com/python-dotenv/)
- **Production Server**: [Gunicorn](https://gunicorn.org/)

## ✨ Key Features

- **Employee Management API**: Endpoints to register employees, upload their photos, and store face encodings securely in the database.
- **AI Recognition Engine**: Processes webcam frames sent from the frontend to identify registered employees in real-time.
- **Attendance Logging**: Automatically records and prevents duplicate attendance entries for the day.
- **Admin Authentication**: Secure JWT-based login for administrators to access the dashboard data.
- **Modular Architecture**: Uses Flask Blueprints to separate routes (`auth`, `employee`, `recognition`).

## 🛠️ Local Setup

1. **Create and activate a virtual environment**:
   It's highly recommended to use a virtual environment to manage dependencies.
   ```powershell
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   ```

2. **Install requirements**:
   *(Note: You may need C++ Build Tools installed on Windows for `dlib` to compile properly, or use a pre-compiled `dlib-bin` wheel).*
   ```powershell
   pip install -r requirements.txt
   ```

3. **Environment Variables**:
   Create a `.env` file in the `backend` directory.
   ```env
   DATABASE_URL=sqlite:///attendance.db
   JWT_SECRET_KEY=your-super-secret-key
   UPLOAD_FOLDER=static/uploads
   ```

4. **Run the server**:
   Make sure you are running the app module from the root directory of the project:
   ```powershell
   cd ..
   python -m backend.app
   ```
   The API will be available at `http://localhost:5000`.

## 🌐 Deployment (Render)

This backend is configured for deployment on [Render](https://render.com) using the included `Procfile`.

1. Connect your GitHub repo to Render and create a new **Web Service**.
2. **Build Command**: `pip install -r backend/requirements.txt`
3. **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT "backend.app:create_app()"`
4. Set the necessary environment variables (`JWT_SECRET_KEY`, etc.) in the Render dashboard.

*(Note: If deploying to a platform without pre-compiled `dlib`, ensure you use the provided `Dockerfile` or a Debian-based environment that can handle `dlib`'s heavy compilation).*
