import React from 'react'
import { Outlet } from 'react-router-dom'
import { Users } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40 text-slate-800 overflow-hidden p-4">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-3xl" />

      <div className="w-full max-w-md z-10">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="p-4 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Users size={30} />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Friends of Finance</h1>
            <p className="text-sm text-slate-500 mt-1 font-semibold">Community Manager CRM</p>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
