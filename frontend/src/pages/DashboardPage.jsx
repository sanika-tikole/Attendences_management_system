import React from 'react'
import PageHeader from '../components/PageHeader.jsx'
import MetricCard from '../components/MetricCard.jsx'
import SpinnerOverlay from '../components/SpinnerOverlay.jsx'
import { getAttendanceHistory } from '../services/attendanceService'
import { getEmployees } from '../services/employeeService'
import { useToast } from '../context/ToastContext.jsx'

export default function DashboardPage() {
  const { pushToast } = useToast()
  const [loading, setLoading] = React.useState(true)
  const [employees, setEmployees] = React.useState([])
  const [attendance, setAttendance] = React.useState([])

  React.useEffect(() => {
    let active = true
    Promise.all([getEmployees(), getAttendanceHistory()])
      .then(([employeeData, attendanceData]) => {
        if (!active) return
        setEmployees(Array.isArray(employeeData) ? employeeData : employeeData?.items || [])
        setAttendance(Array.isArray(attendanceData) ? attendanceData : attendanceData?.items || [])
      })
      .catch(() => pushToast('Unable to load dashboard data. Confirm the Flask APIs are available.', 'error'))
      .finally(() => active && setLoading(false))

    return () => { active = false }
  }, [pushToast])

  const today = new Date().toISOString().slice(0, 10)
  const todayAttendance = attendance.filter((item) => String(item.date || '').startsWith(today))
  const presentCount = todayAttendance.filter((item) => String(item.status).toLowerCase() === 'present').length
  const absentCount = Math.max(employees.length - presentCount, 0)

  if (loading) return <SpinnerOverlay message="Loading dashboard metrics..." />

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Track employees, live attendance, and daily activity at a glance." />

      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6"><MetricCard icon="👥" label="Total Employees" value={employees.length} helper="All registered staff" /></div>
        <div className="col-xl-3 col-md-6"><MetricCard icon="✅" label="Today’s Attendance" value={todayAttendance.length} helper={`Records for ${today}`} /></div>
        <div className="col-xl-3 col-md-6"><MetricCard icon="🟢" label="Present" value={presentCount} helper="Recognized and marked present" /></div>
        <div className="col-xl-3 col-md-6"><MetricCard icon="🟠" label="Absent" value={absentCount} helper="Estimated from today’s summary" /></div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="panel h-100">
            <PageHeader title="Recent Attendance" subtitle="Latest records from the backend." />
            <div className="table-responsive">
              <table className="table-darkish mb-0">
                <thead>
                  <tr><th>Employee</th><th>Date</th><th>Time</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 6).map((row) => (
                    <tr key={row.id || `${row.employee_id}-${row.date}-${row.time}`}>
                      <td>{row.name || row.employee_id}</td>
                      <td>{row.date}</td>
                      <td>{row.time}</td>
                      <td><span className="status-pill">{row.status || 'present'}</span></td>
                    </tr>
                  ))}
                  {!attendance.length ? <tr><td colSpan="4" className="muted py-4">No attendance data yet.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="panel h-100">
            <PageHeader title="System Status" subtitle="Front-end health and integration summary." />
            <div className="d-grid gap-3">
              <div className="glass-card p-3">
                <div className="fw-semibold">API connectivity</div>
                <div className="muted small">Set <code>VITE_API_BASE_URL</code> to your Flask backend.</div>
              </div>
              <div className="glass-card p-3">
                <div className="fw-semibold">Authentication</div>
                <div className="muted small">JWT token storage in localStorage and route protection are enabled.</div>
              </div>
              <div className="glass-card p-3">
                <div className="fw-semibold">Responsive UI</div>
                <div className="muted small">Sidebar collapses on mobile; cards and tables adapt cleanly.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
