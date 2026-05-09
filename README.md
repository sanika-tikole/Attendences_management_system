# 🤖 AI Face Recognition Attendance System

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-2023-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![Flask](https://img.shields.io/badge/Flask-Framework-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

A production-grade, full-stack attendance management solution leveraging state-of-the-art AI for real-time face recognition and automatic logging.

---

## ✨ Features

- 🎯 **High-Precision Recognition**: Uses deep learning to identify employees with high accuracy.
- ⚡ **Real-time Processing**: Optimized for low-latency webcam streams.
- 📊 **Smart Dashboard**: Visualize attendance trends and employee statistics.
- 👥 **Employee Management**: Easy registration with automated face encoding generation.
- 🔐 **Secure Access**: JWT-based authentication for the admin portal.
- 🎨 **Premium UI**: Modern dark-mode interface with smooth transitions and responsive layouts.

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- **Python 3.8+**
- **Node.js 18+**
- **C++ Build Tools** (Required for `dlib`)

### 2. Backend Setup 🐍
```powershell
# Create & Activate Virtual Environment
python -m venv backend/venv

# Install Dependencies
.\backend\venv\Scripts\pip.exe install dlib-bin
backend\venv\Scripts\pip.exe install -r .\backend\requirements.txt

# Start Server
backend\venv\Scripts\python.exe -m backend.app
```

### 3. Frontend Setup ⚛️
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment Guide (Hybrid Architecture)

To achieve a setup where the **Frontend is on Vercel**, the **Backend is on Render**, and you use a **Local Webcam**:

### **1. Backend (Render)**
- Connect your repo to [Render](https://render.com).
- **Start Command**: `gunicorn backend.app:app`
- **Environment Variables**: Set your `JWT_SECRET_KEY` and `UPLOAD_FOLDER`.

### **2. Frontend (Vercel)**
- Connect your repo to [Vercel](https://vercel.com).
- **Environment Variable**: Add `VITE_API_URL` = `https://your-render-app.onrender.com/api`.
- The frontend will automatically connect to your Render API.

### **3. Database**
- Switch from SQLite to **PostgreSQL** for production reliability.

---

## 📑 API Overview

- `POST /api/auth/login` - Admin authentication.
- `GET /api/employees/` - Retrieve employee list.
- `POST /api/employees/register` - Register new staff.
- `POST /api/recognition/process_frame` - AI face detection.
- `GET /api/recognition/history` - Attendance logs.

---

Developed with ❤️ by Antigravity AI
