import React from 'react'

export default function SpinnerOverlay({ message = 'Loading...' }) {
  return (
    <div className="panel text-center py-5">
      <div className="spinner-border text-info" role="status" />
      <div className="mt-3 muted">{message}</div>
    </div>
  )
}
