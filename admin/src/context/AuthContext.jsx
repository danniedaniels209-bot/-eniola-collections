import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('eniola_admin_token')
    if (!t) return setLoading(false)
    api
      .get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('eniola_admin_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const d = await api.post('/auth/admin/login', { email, password })
    localStorage.setItem('eniola_admin_token', d.token)
    setUser(d.user)
    return d.user
  }

  const logout = () => {
    localStorage.removeItem('eniola_admin_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
