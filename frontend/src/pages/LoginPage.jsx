import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const { pushToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const [form, setForm] = React.useState({ email: '', password: '' })
  const [errors, setErrors] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  if (isAuthenticated) return <Navigate to={from} replace />

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (!form.password.trim()) next.password = 'Password is required.'
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      await login(form.email, form.password)
      pushToast('Logged in successfully.', 'success')
      navigate(from, { replace: true })
    } catch (error) {
      pushToast(error?.response?.data?.message || 'Login failed. Confirm your backend auth endpoint.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="glass-card auth-card">
        <section className="auth-hero">
          <div className="brand mb-4">
            <div className="brand-badge">FA</div>
            <div>
              Face Attendance
              <div className="small opacity-75 fw-normal">Secure employee tracking</div>
            </div>
          </div>
          <h1 className="display-6 fw-bold mb-3">Log in to the attendance control center.</h1>
          <p className="lead opacity-90 mb-0">Manage onboarding, live recognition, and attendance analytics from a single responsive dashboard.</p>
          <ul className="auth-list">
            <li>• JWT-based session storage</li>
            <li>• Protected routes and clean API flow</li>
            <li>• Built for mobile and desktop</li>
          </ul>
        </section>

        <section className="auth-panel">
          <h2 className="h4 fw-bold mb-2">Welcome back</h2>
          <p className="muted mb-4">Use your admin credentials to continue.</p>

          <form className="d-grid gap-3" onSubmit={submit} noValidate>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="admin@company.com"
              />
              {errors.email ? <div className="invalid-feedback d-block">{errors.email}</div> : null}
            </div>

            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="••••••••"
              />
              {errors.password ? <div className="invalid-feedback d-block">{errors.password}</div> : null}
            </div>

            <button className="btn btn-primary-soft btn-lg" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 small muted">
            Backend endpoint required: <code>/api/auth/login</code>
          </div>
        </section>
      </div>
    </div>
  )
}
