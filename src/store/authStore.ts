import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Hardcoded community manager credentials (standalone, no backend)
const VALID_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'priya@friendsoffinance.com',
    password: 'fof2025',
    user: { id: 'cm-1', name: 'Priya Mehta', email: 'priya@friendsoffinance.com', role: 'COMMUNITY_MANAGER' },
  },
  {
    email: 'james@friendsoffinance.com',
    password: 'fof2025',
    user: { id: 'cm-2', name: 'James Okafor', email: 'james@friendsoffinance.com', role: 'COMMUNITY_MANAGER' },
  },
  {
    email: 'sophie@friendsoffinance.com',
    password: 'fof2025',
    user: { id: 'cm-3', name: 'Sophie Laurent', email: 'sophie@friendsoffinance.com', role: 'COMMUNITY_MANAGER' },
  },
]

const storedUser = localStorage.getItem('fof_user')

export const useAuthStore = create<AuthState>()((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,

  login: async (email, password) => {
    await new Promise((r) => setTimeout(r, 600)) // simulate async
    const match = VALID_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (!match) throw new Error('Invalid email or password')
    localStorage.setItem('fof_user', JSON.stringify(match.user))
    set({ user: match.user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('fof_user')
    set({ user: null, isAuthenticated: false })
  },
}))
