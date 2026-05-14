import React from 'react'
import PageHeader from '../components/PageHeader.jsx'
import { createEmployee } from '../services/employeeService'
import { useToast } from '../context/ToastContext.jsx'

export default function EmployeeRegistrationPage() {
  const { pushToast } = useToast()
  const [form, setForm] = React.useState({ employee_id: '', name: '', department: '', image: null })
  const [errors, setErrors] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [preview, setPreview] = React.useState('')

  React.useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  const validate = () => {
    const next = {}
    if (!form.employee_id.trim()) next.employee_id = 'Employee ID is required.'
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!form.department.trim()) next.department = 'Department is required.'
    if (!form.image) next.image = 'Upload an employee image.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    setForm((current) => ({ ...current, image: file }))
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      setLoading(true)
      const payload = new FormData()
      payload.append('employee_id', form.employee_id)
      payload.append('name', form.name)
      payload.append('department', form.department)
      payload.append('image', form.image)
      await createEmployee(payload)
      pushToast('Employee registered successfully.', 'success')
      setForm({ employee_id: '', name: '', department: '', image: null })
      setPreview('')
      event.target.reset()
    } catch (error) {
      pushToast(error?.response?.data?.error || 'Failed to register employee.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="Employee Registration" subtitle="Capture employee details and upload a face image for encoding on the Flask backend." />

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="panel">
            <form className="row g-3" onSubmit={submit} noValidate>
              <div className="col-md-6">
                <label className="form-label">Employee ID</label>
                <input className={`form-control ${errors.employee_id ? 'is-invalid' : ''}`} value={form.employee_id} onChange={(event) => setForm((current) => ({ ...current, employee_id: event.target.value }))} />
                {errors.employee_id ? <div className="invalid-feedback d-block">{errors.employee_id}</div> : null}
              </div>
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
                {errors.name ? <div className="invalid-feedback d-block">{errors.name}</div> : null}
              </div>
              <div className="col-12">
                <label className="form-label">Department</label>
                <input className={`form-control ${errors.department ? 'is-invalid' : ''}`} value={form.department} onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))} />
                {errors.department ? <div className="invalid-feedback d-block">{errors.department}</div> : null}
              </div>
              <div className="col-12">
                <label className="form-label">Employee Image</label>
                <input type="file" accept="image/*" className={`form-control ${errors.image ? 'is-invalid' : ''}`} onChange={onImageChange} />
                {errors.image ? <div className="invalid-feedback d-block">{errors.image}</div> : null}
              </div>

              <div className="col-12 d-flex flex-wrap gap-2 align-items-center mt-2">
                <button className="btn btn-primary-soft" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register Employee'}</button>
                <div className="muted small">The image is uploaded and encoded through the backend API.</div>
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="panel h-100">
            <div className="fw-bold mb-3">Image Preview</div>
            {preview ? (
              <img className="w-100 thumbnail" style={{ width: '100%', height: '320px' }} src={preview} alt="Employee preview" />
            ) : (
              <div className="glass-card p-4 text-center muted">Upload a portrait to preview it here.</div>
            )}
            <div className="mt-3 muted small">Recommended: front-facing image with good lighting and a single face in frame.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
