import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import Sidebar from '../components/Sidebar'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Community Overview',
  '/members': 'Member Directory',
  '/follow-up': 'Follow-up Queue',
  '/new-members': 'New Members',
  '/highly-active': 'Highly Active Members',
  '/at-risk': 'At-Risk & Dormant',
  '/help': 'Help & Guide',
}

export const DashboardLayout: React.FC = () => {
  const { user } = useAuthStore()
  const location = useLocation()

  const getPageTitle = () => {
    if (location.pathname.startsWith('/members/')) return 'Member Profile'
    return PAGE_TITLES[location.pathname] ?? 'Friends of Finance CRM'
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Top Header */}
        <header className="flex items-center justify-between px-6 border-b border-slate-200 bg-white h-16 flex-shrink-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold tracking-tight text-slate-800">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-1.5 h-6 bg-slate-200 rounded-full hidden sm:block" />
            <span className="text-xs font-semibold text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            {user && (
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold border border-emerald-200">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
