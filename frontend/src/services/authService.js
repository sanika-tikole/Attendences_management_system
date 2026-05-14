import api from './api'

export async function loginRequest(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password })
  return data
}

export async function fetchProfile() {
  const { data } = await api.get('/api/auth/me')
  return data
}
