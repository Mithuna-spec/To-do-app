/**
 * services/api.js
 * Axios instance + API service functions for all endpoints.
 */
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,  // Send HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
})

// ── Response interceptor: unwrap data or throw ────────────────────────────────
api.interceptors.response.use(
  res => res.data,
  err => {
    const message = err.response?.data?.error || err.message || 'Network error'
    const status = err.response?.status
    return Promise.reject({ message, status })
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  getMe:    ()     => api.get('/auth/me'),
}

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const taskAPI = {
  list:           ()         => api.get('/tasks'),
  create:         (data)     => api.post('/tasks', data),
  get:            (id)       => api.get(`/tasks/${id}`),
  update:         (id, data) => api.patch(`/tasks/${id}`, data),
  toggleComplete: (id)       => api.patch(`/tasks/${id}/complete`),
  delete:         (id)       => api.delete(`/tasks/${id}`),
}

// ── Analytics ─────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  overview: () => api.get('/analytics/overview'),
  weekly:   () => api.get('/analytics/weekly'),
}

// ── Planner ───────────────────────────────────────────────────────────────────
export const plannerAPI = {
  recommendations: ()     => api.get('/planner/recommendations'),
  dailyPlan:       (data) => api.post('/planner/daily-plan', data),
}

// ── Focus Sessions ────────────────────────────────────────────────────────────
export const focusAPI = {
  list:    ()         => api.get('/focus-sessions'),
  start:   (data)     => api.post('/focus-sessions', data),
  update:  (id, data) => api.patch(`/focus-sessions/${id}`, data),
}

export default api
