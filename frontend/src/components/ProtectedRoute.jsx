import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-wrap">
        <div className="panel text-center py-5">
          <div className="spinner-border text-info" role="status" />
          <div className="muted mt-3">Loading your workspace...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return children
}
