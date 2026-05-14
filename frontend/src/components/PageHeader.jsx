import React from 'react'

export default function PageHeader({ title, subtitle, actions = null }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h2 className="h3 fw-bold mb-1">{title}</h2>
        {subtitle ? <p className="muted mb-0">{subtitle}</p> : null}
      </div>
      {actions ? <div className="d-flex gap-2 flex-wrap">{actions}</div> : null}
    </div>
  )
}
