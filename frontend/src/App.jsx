import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import EmployeeRegistrationPage from './pages/EmployeeRegistrationPage.jsx'
import LiveAttendancePage from './pages/LiveAttendancePage.jsx'
import AttendanceHistoryPage from './pages/AttendanceHistoryPage.jsx'
import EmployeeListPage from './pages/EmployeeListPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ToastHost from './components/ToastHost.jsx'
import { useAuth } from './context/AuthContext.jsx'

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <ToastHost />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="employees/register" element={<EmployeeRegistrationPage />} />
          <Route path="attendance/live" element={<LiveAttendancePage />} />
          <Route path="attendance/history" element={<AttendanceHistoryPage />} />
          <Route path="employees" element={<EmployeeListPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
