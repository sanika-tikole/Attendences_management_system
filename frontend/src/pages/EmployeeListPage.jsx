import React from 'react'
import PageHeader from '../components/PageHeader.jsx'
import SpinnerOverlay from '../components/SpinnerOverlay.jsx'
import { getEmployees, removeEmployee, updateEmployee } from '../services/employeeService'
import { useToast } from '../context/ToastContext.jsx'

export default function EmployeeListPage() {
  const { pushToast } = useToast()
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [query, setQuery] = React.useState('')

  const loadEmployees = React.useCallback(() => {
    setLoading(true)
    getEmployees()
      .then((data) => setItems(Array.isArray(data) ? data : data?.items || []))
      .catch(() => pushToast('Failed to load employee list.', 'error'))
      .finally(() => setLoading(false))
  }, [pushToast])

  React.useEffect(() => { loadEmployees() }, [loadEmployees])

  const filtered = items.filter((item) => [item.name, item.employee_id, item.department].some((value) => String(value || '').toLowerCase().includes(query.toLowerCase())))

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return
    try {
      await removeEmployee(id)
      pushToast('Employee deleted.', 'success')
      loadEmployees()
    } catch {
      pushToast('Delete failed. Check the backend API.', 'error')
    }
  }

  const handleQuickEdit = async (employee) => {
    const nextDepartment = window.prompt('Update department:', employee.department || '')
    if (nextDepartment === null) return
    try {
      await updateEmployee(employee.id, { ...employee, department: nextDepartment })
      pushToast('Employee updated.', 'success')
      loadEmployees()
    } catch {
      pushToast('Update failed. Check the backend API.', 'error')
    }
  }

  if (loading) return <SpinnerOverlay message="Loading employee records..." />

  return (
    <div>
      <PageHeader title="Employee List" subtitle="Search, edit, and delete employees from a clean management table." />

      <div className="panel mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-8">
            <input className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by employee ID, name, or department" />
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <button className="btn btn-outline-soft" onClick={loadEmployees}>Refresh</button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {filtered.map((employee) => (
          <div className="col-12 col-md-6 col-xxl-4" key={employee.id || employee.employee_id}>
            <div className="panel h-100">
              <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                <div>
                  <div className="fw-bold fs-5">{employee.name}</div>
                  <div className="muted small">{employee.employee_id}</div>
                </div>
                <span className="status-pill">{employee.department || 'Department'}</span>
              </div>

              <div className="glass-card p-3 mb-3 d-flex align-items-center gap-3">
                <img src={employee.image_path ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${employee.image_path}` : 'https://placehold.co/88x88'} alt={employee.name} className="thumbnail" />
                <div>
                  <div className="fw-semibold">Employee ID</div>
                  <div className="muted small">{employee.employee_id}</div>
                  <div className="fw-semibold mt-2">Department</div>
                  <div className="muted small">{employee.department}</div>
                </div>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-soft" onClick={() => handleQuickEdit(employee)}>Edit</button>
                <button className="btn btn-outline-danger" onClick={() => handleDelete(employee.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        {!filtered.length ? <div className="col-12"><div className="panel muted">No employees found for the current search.</div></div> : null}
      </div>
    </div>
  )
}
