/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Filter, ChevronRight, X } from 'lucide-react'
import { useMemberStore } from '../../store/memberStore'
import { useAuthStore } from '../../store/authStore'
import type { ActivityState, CommunitySpace, Member, MemberRole } from '../../types'

const STATE_BADGE: Record<ActivityState, string> = {
  'Newly Joined': 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  'Active': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'Highly Active': 'bg-violet-100 text-violet-800 ring-violet-200',
  'At Risk': 'bg-amber-100 text-amber-800 ring-amber-200',
  'Dormant': 'bg-red-100 text-red-800 ring-red-200',
}

const ALL_SPACES: CommunitySpace[] = [
  '#introductions', '#market-commentary', '#resources-library', '#events-calendar',
  '#peer-intros', '#job-board', '#tools-and-tech', '#general-chat', '#study-groups', '#alumni-network',
]

const ALL_ROLES: MemberRole[] = [
  'Student', 'Graduate', 'Early Professional', 'Mid-career Professional',
  'Senior Professional', 'Mentor', 'Alumni',
]

const EMPTY: Omit<Member, 'id'> = {
  name: '', email: '', phone: '', joinDate: new Date().toISOString().split('T')[0],
  role: 'Early Professional', primarySpace: '#introductions', interests: [],
  bio: '', ownerId: '', ownerName: '', nextAction: '', onboardingComplete: false,
  welcomeCallDone: false, avatarColor: 'bg-slate-400',
}

const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-blue-500', 'bg-violet-500', 'bg-teal-500', 'bg-pink-500',
  'bg-orange-500', 'bg-cyan-500', 'bg-amber-500', 'bg-rose-500', 'bg-indigo-500',
]

export const Members: React.FC = () => {
  const { getMembersWithState, addMember } = useMemberStore()
  const { user } = useAuthStore()
  const members = getMembersWithState()

  const [search, setSearch] = useState('')
  const [filterState, setFilterState] = useState<ActivityState | ''>('')
  const [filterSpace, setFilterSpace] = useState<CommunitySpace | ''>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMember, setNewMember] = useState<Omit<Member, 'id'>>(EMPTY)
  const [interestInput, setInterestInput] = useState('')

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase()
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
      const matchesState = !filterState || m.activityState === filterState
      const matchesSpace = !filterSpace || m.primarySpace === filterSpace
      return matchesSearch && matchesState && matchesSpace
    })
  }, [members, search, filterState, filterSpace])

  const handleAdd = () => {
    if (!newMember.name || !newMember.email) return
    addMember({
      ...newMember,
      ownerName: user?.name ?? '',
      ownerId: user?.id ?? '',
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    })
    setShowAddModal(false)
    setNewMember(EMPTY)
    setInterestInput('')
  }

  const addInterest = () => {
    const trimmed = interestInput.trim()
    if (trimmed && !newMember.interests.includes(trimmed)) {
      setNewMember((p) => ({ ...p, interests: [...p.interests, trimmed] }))
      setInterestInput('')
    }
  }

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">All Members</h1>
          <p className="text-sm text-slate-500 mt-0.5">{members.length} members · {filtered.length} shown</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-52">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, role…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <div className="relative">
          <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as ActivityState | '')}
            className="pl-8 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
          >
            <option value="">All States</option>
            {(['Newly Joined', 'Active', 'Highly Active', 'At Risk', 'Dormant'] as ActivityState[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="relative">
          <select
            value={filterSpace}
            onChange={(e) => setFilterSpace(e.target.value as CommunitySpace | '')}
            className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer appearance-none"
          >
            <option value="">All Spaces</option>
            {ALL_SPACES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {(filterState || filterSpace || search) && (
          <button
            onClick={() => { setSearch(''); setFilterState(''); setFilterSpace('') }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-3 py-2 rounded-xl border border-slate-200 bg-white cursor-pointer"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">State</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Role</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Primary Space</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Events 30d</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Owner</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${m.avatarColor}`}>
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${STATE_BADGE[m.activityState]}`}>
                      {m.activityState}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-slate-600">{m.role}</td>
                  <td className="px-5 py-4 hidden lg:table-cell text-slate-500 text-xs font-mono">{m.primarySpace}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="font-bold text-slate-700">{m.activityCount30d}</span>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell text-slate-500 text-xs">{m.ownerName ?? '—'}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      to={`/members/${m.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              No members match your current filters.
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-800">Add New Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Full Name *', field: 'name', type: 'text' },
                { label: 'Email *', field: 'email', type: 'email' },
                { label: 'Phone', field: 'phone', type: 'tel' },
                { label: 'Join Date', field: 'joinDate', type: 'date' },
                { label: 'LinkedIn', field: 'linkedIn', type: 'url' },
              ].map(({ label, field, type }) => (
                <div key={field}>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">{label}</label>
                  <input
                    type={type}
                    value={(newMember as any)[field] ?? ''}
                    onChange={(e) => setNewMember((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember((p) => ({ ...p, role: e.target.value as MemberRole }))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Primary Community Space</label>
                <select
                  value={newMember.primarySpace}
                  onChange={(e) => setNewMember((p) => ({ ...p, primarySpace: e.target.value as CommunitySpace }))}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {ALL_SPACES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Interests (press Enter to add)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="e.g. ESG Investing"
                    className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button onClick={addInterest} className="px-3 py-2 text-sm font-bold bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {newMember.interests.map((i) => (
                    <span key={i} className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                      {i}
                      <button onClick={() => setNewMember((p) => ({ ...p, interests: p.interests.filter((x) => x !== i) }))} className="cursor-pointer">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Bio</label>
                <textarea
                  value={newMember.bio}
                  onChange={(e) => setNewMember((p) => ({ ...p, bio: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 text-sm font-bold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >Cancel</button>
              <button
                onClick={handleAdd}
                disabled={!newMember.name || !newMember.email}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >Add Member</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Members
