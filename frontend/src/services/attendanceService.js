import api from './api'

export async function getAttendanceHistory(params = {}) {
  const { data } = await api.get('/api/attendance', { params })
  return data
}

export async function recognizeFace(formData) {
  const { data } = await api.post('/api/recognition/match', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}
