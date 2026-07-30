import { create } from 'zustand'
import type { User } from '../types'
import { api } from '../services/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (workspaceName: string, email: string, password: string) => Promise<User>
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial state from localStorage
  const cachedUser = localStorage.getItem('crm_user')
  const cachedToken = localStorage.getItem('crm_token')

  return {
    user: cachedUser ? JSON.parse(cachedUser) : null,
    token: cachedToken,
    isAuthenticated: !!cachedToken,
    isLoading: false,
    error: null,

    login: async (workspaceName, email, password) => {
      set({ isLoading: true, error: null })
      try {
        const response = await api.post('/auth/login', { workspaceName, email, password })
        const { user, token } = response.data

        localStorage.setItem('crm_token', token)
        localStorage.setItem('crm_user', JSON.stringify(user))

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        return user
      } catch (err: any) {
        const errMsg = err.data?.message || 'Login failed. Please check your credentials.'
        set({ error: errMsg, isLoading: false })
        throw new Error(errMsg)
      }
    },

    logout: () => {
      localStorage.removeItem('crm_token')
      localStorage.removeItem('crm_user')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    },

    clearError: () => set({ error: null }),
  }
})
