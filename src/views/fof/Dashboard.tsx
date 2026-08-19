import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, UserPlus, Star, AlertTriangle, Clock,
  TrendingUp, Activity, ChevronRight, Calendar,
  MessageSquare, Download, UserCheck,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts'
import { useMemberStore } from '../../store/memberStore'
import type { ActivityState } from '../../types'

const STATE_COLORS: Record<ActivityState, string> = {
  'Newly Joined': '#06b6d4',
  'Active': '#10b981',
  'Highly Active': '#8b5cf6',
  'At Risk': '#f59e0b',
  'Dormant': '#ef4444',
}



const EVENT_ICON: Record<string, React.ReactNode> = {
  'Post in channel': <MessageSquare size={14} />,
  'Reply / comment': <MessageSquare size={14} />,
  'Event RSVP': <Calendar size={14} />,
  'Event attended': <Calendar size={14} />,
  'Resource downloaded': <Download size={14} />,
  'Peer intro accepted': <UserCheck size={14} />,
  'Welcome call': <UserCheck size={14} />,
  'Poll responded': <Activity size={14} />,
  'Direct message': <MessageSquare size={14} />,
  'Community call attended': <Calendar size={14} />,
}

export const Dashboard: React.FC = () => {
  const { getMembersWithState, activities } = useMemberStore()
  const members = getMembersWithState()

  const stats = useMemo(() => {
    const counts: Record<ActivityState, number> = {
      'Newly Joined': 0, 'Active': 0, 'Highly Active': 0, 'At Risk': 0, 'Dormant': 0,
    }
    members.forEach((m) => counts[m.activityState]++)
    return counts
  }, [members])

  const pieData = Object.entries(stats).map(([name, value]) => ({ name, value }))

  // Weekly activity bar chart: last 7 days
  const barData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const label = d.toLocaleDateString('en-GB', { weekday: 'short' })
      const dateStr = d.toISOString().split('T')[0]
      const count = activities.filter((a) => a.date === dateStr).length
      return { day: label, events: count }
    })
  }, [activities])

  // Recent 8 activities across all members
  const recentActivity = useMemo(() => {
    return [...activities]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8)
      .map((act) => ({
        ...act,
        memberName: members.find((m) => m.id === act.memberId)?.name ?? 'Unknown',
      }))
  }, [activities, members])

  const needsFollowUp = members.filter(
    (m) => m.activityState === 'At Risk' || m.activityState === 'Dormant'
  ).length

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Community Overview</h1>
        <p className="text-sm text-slate-500 mt-1">
          Friends of Finance · {members.length} members · {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(Object.entries(stats) as [ActivityState, number][]).map(([state, count]) => (
          <div
            key={state}
            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-semibold text-slate-500 mb-1">{state}</p>
            <p className="text-3xl font-extrabold text-slate-800">{count}</p>
            <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: STATE_COLORS[state] }} />
          </div>
        ))}
      </div>

      {/* Alert Banner */}
      {needsFollowUp > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-semibold flex-1">
            <strong>{needsFollowUp} members</strong> are At Risk or Dormant and need follow-up.
          </p>
          <Link
            to="/follow-up"
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 whitespace-nowrap"
          >
            View Queue <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            Activity Events — Last 7 Days
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="events" radius={[6, 6, 0, 0]} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Users size={16} className="text-violet-500" />
            Member State Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={STATE_COLORS[entry.name as ActivityState]} />
                ))}
              </Pie>
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(val) => <span style={{ fontSize: 11, color: '#475569' }}>{val}</span>}
              />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-500" />
            Recent Activity Feed
          </h2>
          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
                  {EVENT_ICON[act.type] ?? <Activity size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {act.memberName}
                    <span className="font-normal text-slate-500"> — {act.type}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{act.space} · {act.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            {[
              { to: '/members', icon: Users, label: 'View All Members', sub: `${members.length} total`, color: 'text-blue-600 bg-blue-50' },
              { to: '/new-members', icon: UserPlus, label: 'Onboard New Members', sub: `${stats['Newly Joined']} newly joined`, color: 'text-cyan-600 bg-cyan-50' },
              { to: '/highly-active', icon: Star, label: 'Engage Power Members', sub: `${stats['Highly Active']} highly active`, color: 'text-violet-600 bg-violet-50' },
              { to: '/follow-up', icon: AlertTriangle, label: 'Follow-up Queue', sub: `${needsFollowUp} need attention`, color: 'text-amber-600 bg-amber-50' },
            ].map(({ to, icon: Icon, label, sub, color }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
