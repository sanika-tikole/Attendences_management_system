import api from './api'

export async function getEmployees() {
  const { data } = await api.get('/api/employees')
  return data
}

export async function createEmployee(formData) {
  const { data } = await api.post('/api/employees', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function updateEmployee(id, payload) {
  const { data } = await api.put(`/api/employees/${id}`, payload)
  return data
}

export async function removeEmployee(id) {
  const { data } = await api.delete(`/api/employees/${id}`)
  return data
}
