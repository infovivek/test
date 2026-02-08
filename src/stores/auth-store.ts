import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Tokens {
  access_token: string
  refresh_token: string
}

interface User {
  id: string
  name: string
  mobileNumber: string
  role: string
  email?: string
}

interface AuthState {
  tokens: Tokens | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  setTokens: (tokens: Tokens) => void
  setUser: (user: User) => void
  login: (tokens: Tokens, user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tokens: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setTokens: (tokens) => set({ tokens, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      login: (tokens, user) => set({ tokens, user, isAuthenticated: true }),
      logout: () =>
        set({ tokens: null, user: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "auth-storage",
    }
  )
)
