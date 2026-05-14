import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="auth-wrap">
      <div className="panel text-center">
        <div className="display-5 fw-bold mb-3">404</div>
        <p className="muted mb-4">This page could not be found.</p>
        <Link className="btn btn-primary-soft" to="/">Go to dashboard</Link>
      </div>
    </div>
  )
}
