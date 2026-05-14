import React from 'react'
import PageHeader from '../components/PageHeader.jsx'
import SpinnerOverlay from '../components/SpinnerOverlay.jsx'
import { getAttendanceHistory } from '../services/attendanceService'
import { useToast } from '../context/ToastContext.jsx'

const PAGE_SIZE = 8

export default function AttendanceHistoryPage() {
  const { pushToast } = useToast()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [dateFilter, setDateFilter] = React.useState('')
  const [page, setPage] = React.useState(1)

  React.useEffect(() => {
    let active = true
    getAttendanceHistory()
      .then((data) => active && setItems(Array.isArray(data) ? data : data?.items || []))
      .catch(() => pushToast('Failed to load attendance history.', 'error'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [pushToast])

  const filtered = items.filter((item) => {
    const byQuery = [item.name, item.employee_id, item.status].some((value) => String(value || '').toLowerCase().includes(query.toLowerCase()))
    const byDate = dateFilter ? String(item.date || '').startsWith(dateFilter) : true
    return byQuery && byDate
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  React.useEffect(() => { if (page > totalPages) setPage(totalPages) }, [page, totalPages])

  const exportCSV = () => {
    const headers = ['employee_id', 'name', 'date', 'time', 'status']
    const csv = [headers.join(','), ...filtered.map((item) => headers.map((header) => JSON.stringify(item[header] ?? '')).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'attendance-history.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  if (loading) return <SpinnerOverlay message="Loading attendance history..." />

  return (
    <div>
      <PageHeader title="Attendance History" subtitle="Search, filter by date, paginate results, and export a CSV report." actions={<button className="btn btn-primary-soft" onClick={exportCSV}>Export CSV</button>} />

      <div className="panel mb-4">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-6">
            <label className="form-label">Search</label>
            <input className="form-control" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Search employee name, ID, or status" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label">Filter by date</label>
            <input type="date" className="form-control" value={dateFilter} onChange={(event) => { setDateFilter(event.target.value); setPage(1) }} />
          </div>
          <div className="col-12 col-md-2 d-grid">
            <button className="btn btn-outline-soft" onClick={() => { setQuery(''); setDateFilter(''); setPage(1) }}>Reset</button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="table-responsive">
          <table className="table-darkish mb-0">
            <thead>
              <tr><th>Employee ID</th><th>Name</th><th>Date</th><th>Time</th><th>Status</th></tr>
            </thead>
            <tbody>
              {currentPageItems.map((item) => (
                <tr key={item.id || `${item.employee_id}-${item.date}-${item.time}`}>
                  <td>{item.employee_id}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>{item.time}</td>
                  <td><span className="status-pill">{item.status}</span></td>
                </tr>
              ))}
              {!currentPageItems.length ? <tr><td colSpan="5" className="muted py-4">No records match the current filters.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
          <div className="muted small">Showing {currentPageItems.length} of {filtered.length} records</div>
          <div className="d-flex gap-2 flex-wrap align-items-center">
            <button className="btn btn-outline-soft" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1}>Previous</button>
            <span className="status-pill">Page {page} of {totalPages}</span>
            <button className="btn btn-outline-soft" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
