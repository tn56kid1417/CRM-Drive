import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { SIDEBAR_NAV } from '../constants/navigation'
import { cn } from '../utils/cn'

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()

  if (!user) return null

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen border-r border-slate-200 bg-white transition-all duration-300 z-30',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-teal-50 h-16">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 bg-emerald-600 text-white rounded-xl flex items-center justify-center flex-shrink-0">
            <Users size={18} />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <span className="font-extrabold text-sm tracking-tight text-emerald-900 block truncate">
                Friends of Finance
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Community CRM</span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-18 p-1 bg-white text-slate-600 border border-slate-200 rounded-full hover:bg-slate-50 cursor-pointer shadow-sm z-40 hidden md:block"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav List */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {SIDEBAR_NAV.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative',
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
              )}
            >
              <Icon
                size={18}
                className={cn(
                  'flex-shrink-0 transition-transform group-hover:scale-105',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'
                )}
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}

              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Profile + Logout */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
        <div className={cn('flex items-center gap-3', isCollapsed ? 'justify-center' : 'justify-start')}>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-emerald-200">
            {user.name.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 leading-tight truncate">{user.name}</p>
              <p className="text-xs text-slate-500">Community Manager</p>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3.5 w-full px-3.5 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group relative cursor-pointer',
            isCollapsed && 'justify-center'
          )}
        >
          <LogOut size={18} className="flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          {!isCollapsed && <span>Log out</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-red-600 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              Log out
            </div>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
