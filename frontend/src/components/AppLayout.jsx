import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'

const menu = [
  { label: 'Dashboard', path: '/' },
  { label: 'Employee Registration', path: '/employees/register' },
  { label: 'Live Attendance', path: '/attendance/live' },
  { label: 'Attendance History', path: '/attendance/history' },
  { label: 'Employee List', path: '/employees' }
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  React.useEffect(() => setSidebarOpen(false), [location.pathname])

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-badge">FA</div>
          <div>
            Face Attendance
            <div className="muted fw-normal small">Smart recognition dashboard</div>
          </div>
        </div>

        <div className="nav-section-title">Navigation</div>
        <div className="d-grid gap-2">
          {menu.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-section-title">Account</div>
        <div className="panel p-3">
          <div className="fw-semibold">{user?.name || user?.email || 'Admin User'}</div>
          <div className="muted small mb-3">JWT token stored locally</div>
          <div className="d-grid gap-2">
            <button type="button" className="btn btn-outline-soft" onClick={toggleTheme}>
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={logout}>Logout</button>
          </div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="d-flex align-items-center gap-3">
            <button type="button" className="btn btn-outline-soft d-lg-none" onClick={() => setSidebarOpen((value) => !value)}>Menu</button>
            <div>
              <h1 className="topbar-title">Face Recognition Attendance System</h1>
              <p className="topbar-subtitle">Modern operations dashboard for registration, live attendance, and reports.</p>
            </div>
          </div>
          <div className="d-none d-md-flex align-items-center gap-3">
            <span className="status-pill">{theme === 'dark' ? 'Dark theme' : 'Light theme'}</span>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
