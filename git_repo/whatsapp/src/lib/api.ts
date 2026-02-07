import axios from "axios"
import { useAuthStore } from "@/stores/auth-store"

const API_BASE_URL = "/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const { tokens } = useAuthStore.getState()
  if (tokens?.access_token) {
    config.headers.Authorization = `Bearer ${tokens.access_token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const { tokens, setTokens, logout } = useAuthStore.getState()
      if (tokens?.refresh_token) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: tokens.refresh_token,
          })
          setTokens(res.data)
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`
          return api(originalRequest)
        } catch {
          logout()
          window.location.href = "/auth/login"
        }
      } else {
        logout()
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  }
)
