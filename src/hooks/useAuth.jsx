/**
 * hooks/useAuth.jsx
 * Auth context providing user state, login, register, logout across the app.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api.jsx'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)  // True while checking session on mount

  // Check existing session on first load
  useEffect(() => {
    let cancelled = false
    authAPI.getMe()
      .then(data => { if (!cancelled) setUser(data.user) })
      .catch(() => { if (!cancelled) setUser(null) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login({ email, password })
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const data = await authAPI.register({ name, email, password })
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(async () => {
    await authAPI.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
