import React from 'react'

export default function MetricCard({ icon, label, value, helper }) {
  return (
    <div className="metric-card h-100">
      <div className="metric-icon">{icon}</div>
      <p className="metric-label">{label}</p>
      <h3 className="metric-value">{value}</h3>
      {helper ? <div className="muted small mt-2">{helper}</div> : null}
    </div>
  )
}
