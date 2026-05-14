# Face Recognition Attendance Frontend

Modern React.js frontend for a Face Recognition Attendance System.

## Stack
- React 18
- React Router DOM
- Axios
- Bootstrap 5
- Context API

## Pages
- Login
- Dashboard
- Employee Registration
- Live Attendance Camera
- Attendance History
- Employee List

## Setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

## API Expectations

Set `VITE_API_BASE_URL` to your Flask backend URL. The app expects these endpoints:
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`
- `GET /api/attendance`
- `POST /api/recognize`

If your backend routes differ, adjust the services in `src/services`.
