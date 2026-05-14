import React from 'react'
import { fetchProfile, loginRequest } from '../services/authService'

const AuthContext = React.createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      setLoading(false)
      return
    }

    fetchProfile()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('auth_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await loginRequest(email, password)
    if (data?.token) localStorage.setItem('auth_token', data.token)
    setUser(data.user || { email })
    return data
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  const value = React.useMemo(() => ({ user, loading, isAuthenticated: Boolean(user), login, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
