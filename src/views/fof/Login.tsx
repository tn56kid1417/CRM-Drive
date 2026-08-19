import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

export const Login: React.FC = () => {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-slate-600 mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="priya@friendsoffinance.com"
            required
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 mb-1.5 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="fof2025"
              required
              className="w-full px-4 py-3 pr-11 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-500 mb-2">Demo Credentials</p>
        <div className="space-y-1.5 text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
          <p>priya@friendsoffinance.com / fof2025</p>
          <p>james@friendsoffinance.com / fof2025</p>
          <p>sophie@friendsoffinance.com / fof2025</p>
        </div>
      </div>
    </div>
  )
}

export default Login
