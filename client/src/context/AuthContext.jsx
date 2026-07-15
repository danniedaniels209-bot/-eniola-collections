import { createContext, useContext, useEffect, useState } from 'react'
import { api, setToken, clearToken, getToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!getToken()) return setReady(true)
    api
      .get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => clearToken())
      .finally(() => setReady(true))
  }, [])

  const login = async (email, password) => {
    const d = await api.post('/auth/login', { email, password })
    setToken(d.token)
    setUser(d.user)
    return d.user
  }

  const register = async (payload) => {
    const d = await api.post('/auth/register', payload)
    setToken(d.token)
    setUser(d.user)
    return d.user
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  const updateProfile = async (patch) => {
    const d = await api.put('/auth/profile', patch)
    setUser(d.user)
    return d.user
  }

  const changePassword = (currentPassword, newPassword) =>
    api.put('/auth/password', { currentPassword, newPassword })

  return (
    <AuthContext.Provider
      value={{ user, ready, login, register, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
