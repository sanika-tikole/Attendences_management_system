# 🤖 AI Face Recognition Attendance System - Frontend

This is the frontend application for the AI Face Recognition Attendance System. It is built using **React** and **Vite**, featuring a premium "Neural Dark" UI and seamless API integration with the Flask backend.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management & API Calls**: [Axios](https://axios-http.com/)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

## ✨ Key Features

- **Dashboard**: Real-time visualization of attendance trends and statistics using Recharts.
- **Live Recognition Interface**: Connects to the local webcam to detect and verify employees automatically.
- **Employee Management**: Interface to register new employees and capture their face data.
- **Attendance Logs**: View and filter historical attendance records.
- **Admin Authentication**: JWT-based login system for securing the dashboard.
- **Responsive "Neural Dark" UI**: A premium, modern dark-mode aesthetic with smooth glassmorphism effects and animations.

## 🛠️ Local Setup

1. **Install dependencies**:
   Ensure you are in the `frontend` directory, then run:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the `frontend` directory based on `.env.example`.
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will typically be available at `http://localhost:5173`.

## 🌐 Deployment (Vercel)

This frontend is configured for easy deployment on [Vercel](https://vercel.com).
The routing is handled via the included `vercel.json` file.

1. Connect your GitHub repository to Vercel.
2. During setup, make sure to add your production API URL as an environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-production-backend-url.com/api`
3. Deploy!
