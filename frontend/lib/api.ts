import axios from 'axios'

// Smart Detection: Use Domain if we are on the server, otherwise use localhost
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If we are running locally, ALWAYS use localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001'
    }
    
    // If the browser URL contains the VPS IP or the NEW Domain, use the production backend
    if (
      hostname === '76.13.15.98' || 
      hostname === 'srv1626419.hstgr.cloud' || 
      hostname === 'egyptiancyclingobservatory.com' ||
      hostname === 'www.egyptiancyclingobservatory.com'
    ) {
      // In production with a domain, we usually use the domain directly
      return 'https://egyptiancyclingobservatory.com/api'
    }
  }
  
  // Fallback for SSR or other cases
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
}

export const API_BASE_URL = getBaseUrl().replace(/\/api$/, '')

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Helper to get full image URL
export const getImageUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api