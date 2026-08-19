import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Edit2, Save, X, Plus, Activity, Sparkles,
  Loader2, ExternalLink, CheckCircle, Circle,
} from 'lucide-react'
import { useMemberStore } from '../../store/memberStore'
import { useAuthStore } from '../../store/authStore'
import type { ActivityEventType, CommunitySpace, AISuggestionType, MemberRole } from '../../types'

const STATE_BADGE: Record<string, string> = {
  'Newly Joined': 'bg-cyan-100 text-cyan-800',
  'Active': 'bg-emerald-100 text-emerald-800',
  'Highly Active': 'bg-violet-100 text-violet-800',
  'At Risk': 'bg-amber-100 text-amber-800',
  'Dormant': 'bg-red-100 text-red-800',
}

const EVENT_COLORS: Record<string, string> = {
  'Post in channel': 'bg-blue-100 text-blue-700',
  'Reply / comment': 'bg-sky-100 text-sky-700',
  'Event RSVP': 'bg-violet-100 text-violet-700',
  'Event attended': 'bg-purple-100 text-purple-700',
  'Resource downloaded': 'bg-teal-100 text-teal-700',
  'Peer intro accepted': 'bg-emerald-100 text-emerald-700',
  'Welcome call': 'bg-green-100 text-green-700',
  'Poll responded': 'bg-amber-100 text-amber-700',
  'Direct message': 'bg-orange-100 text-orange-700',
  'Community call attended': 'bg-pink-100 text-pink-700',
}

const ALL_EVENT_TYPES: ActivityEventType[] = [
  'Post in channel', 'Reply / comment', 'Event RSVP', 'Event attended',
  'Resource downloaded', 'Peer intro accepted', 'Welcome call',
  'Poll responded', 'Direct message', 'Community call attended',
]

const ALL_SPACES: CommunitySpace[] = [
  '#introductions', '#market-commentary', '#resources-library', '#events-calendar',
  '#peer-intros', '#job-board', '#tools-and-tech', '#general-chat', '#study-groups', '#alumni-network',
]

const ALL_ROLES: MemberRole[] = [
  'Student', 'Graduate', 'Early Professional', 'Mid-career Professional',
  'Senior Professional', 'Mentor', 'Alumni',
]

const AI_ACTIONS: { type: AISuggestionType; label: string; icon: string }[] = [
  { type: 'activity_summary', label: 'Summarise Activity', icon: '📊' },
  { type: 'space_suggestion', label: 'Suggest Space', icon: '🗺️' },
  { type: 'peer_intro', label: 'Suggest Peer Intro', icon: '🤝' },
  { type: 'activation_message', label: 'Draft Activation Message', icon: '✉️' },
  { type: 'next_step', label: 'Recommend Next Step', icon: '🧭' },
]

export const MemberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getMemberWithState, updateMember, addActivity, getAISuggestion } = useMemberStore()
  const { user } = useAuthStore()

  const member = getMemberWithState(id ?? '')

  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState<Record<string, any>>({})
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [newAct, setNewAct] = useState({ type: 'Post in channel' as ActivityEventType, space: '#general-chat' as CommunitySpace, description: '', commercialFlag: false, commercialNote: '' })
  const [aiSuggestion, setAiSuggestion] = useState<{ label: string; content: string; disclaimer: string } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-lg font-semibold mb-2">Member not found</p>
        <Link to="/members" className="text-sm text-emerald-600 hover:underline">← Back to Members</Link>
      </div>
    )
  }

  const startEdit = () => {
    setEditData({
      name: member.name, email: member.email, phone: member.phone,
      role: member.role, primarySpace: member.primarySpace, bio: member.bio,
      linkedIn: member.linkedIn, ownerName: member.ownerName, ownerId: member.ownerId,
      nextAction: member.nextAction, nextActionDue: member.nextActionDue,
      notes: member.notes, onboardingComplete: member.onboardingComplete,
      welcomeCallDone: member.welcomeCallDone,
    })
    setEditing(true)
  }

  const saveEdit = () => {
    updateMember(member.id, editData)
    setEditing(false)
  }

  const handleAddActivity = () => {
    if (!newAct.description) return
    addActivity({
      memberId: member.id,
      type: newAct.type,
      space: newAct.space,
      description: newAct.description,
      date: new Date().toISOString().split('T')[0],
      loggedBy: user?.name ?? 'Community Manager',
      ...(newAct.commercialFlag ? { commercialFlag: true, commercialNote: newAct.commercialNote } : {}),
    })
    setNewAct({ type: 'Post in channel', space: '#general-chat', description: '', commercialFlag: false, commercialNote: '' })
    setShowAddActivity(false)
  }

  const runAI = async (type: AISuggestionType) => {
    setAiLoading(true)
    setAiSuggestion(null)
    await new Promise((r) => setTimeout(r, 900))
    const result = getAISuggestion(member.id, type)
    setAiSuggestion(result ? { label: result.label, content: result.content, disclaimer: result.disclaimer } : null)
    setAiLoading(false)
  }

  const daysSince = member.lastActivityDate
    ? Math.round((Date.now() - new Date(member.lastActivityDate).getTime()) / 86_400_000)
    : null

  return (
    <div className="space-y-6 animate-slide-up max-w-5xl">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
          <ArrowLeft size={18} className="text-slate-600" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-800">{member.name}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATE_BADGE[member.activityState]}`}>
              {member.activityState}
            </span>
            {member.activityState === 'Highly Active' && <span className="text-yellow-500">⭐</span>}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{member.email} · Joined {member.joinDate}</p>
        </div>
        <div className="flex gap-2">
          {!editing ? (
            <button onClick={startEdit} className="flex items-center gap-1.5 text-sm font-bold text-slate-600 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <Edit2 size={14} /> Edit
            </button>
          ) : (
            <>
              <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 text-sm font-bold text-slate-500 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-50 cursor-pointer">
                <X size={14} /> Cancel
              </button>
              <button onClick={saveEdit} className="flex items-center gap-1.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl cursor-pointer">
                <Save size={14} /> Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile + Next Action */}
        <div className="space-y-5">
          {/* Avatar + Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-center">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl mx-auto mb-3 ${member.avatarColor}`}>
              {member.name.charAt(0)}
            </div>
            <p className="text-sm text-slate-500 font-semibold">{member.role}</p>
            <p className="text-xs text-slate-400 font-mono mt-1">{member.primarySpace}</p>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{member.activityCount30d}</p>
                <p className="text-xs text-slate-400">Events 30d</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-800">{member.allActivities.length}</p>
                <p className="text-xs text-slate-400">Total Events</p>
              </div>
            </div>
            {daysSince !== null && (
              <p className="text-xs text-slate-500 mt-3">
                Last activity: <strong>{daysSince === 0 ? 'Today' : `${daysSince}d ago`}</strong>
              </p>
            )}
          </div>

          {/* Onboarding */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Onboarding</p>
            {[
              { label: 'Welcome Call', field: 'welcomeCallDone' as keyof typeof editData },
              { label: 'Onboarding Complete', field: 'onboardingComplete' as keyof typeof editData },
            ].map(({ label, field }) => {
              const val = editing ? editData[field as string] : (member as any)[field]
              return (
                <div key={field} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <span className="text-sm text-slate-700">{label}</span>
                  {editing ? (
                    <input type="checkbox" checked={!!val} onChange={(e) => setEditData((p) => ({ ...p, [field]: e.target.checked }))} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                  ) : val ? (
                    <CheckCircle size={16} className="text-emerald-500" />
                  ) : (
                    <Circle size={16} className="text-slate-300" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Profile Fields */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Profile</p>
            {[
              { label: 'Name', field: 'name' },
              { label: 'Email', field: 'email' },
              { label: 'Phone', field: 'phone' },
            ].map(({ label, field }) => (
              <div key={field} className="mb-3">
                <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                {editing ? (
                  <input
                    value={editData[field] ?? ''}
                    onChange={(e) => setEditData((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                ) : (
                  <p className="text-sm font-semibold text-slate-800">{(member as any)[field] || '—'}</p>
                )}
              </div>
            ))}
            <div className="mb-3">
              <p className="text-xs text-slate-400 mb-0.5">Role</p>
              {editing ? (
                <select value={editData.role ?? member.role} onChange={(e) => setEditData((p) => ({ ...p, role: e.target.value }))} className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              ) : (
                <p className="text-sm font-semibold text-slate-800">{member.role}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">LinkedIn</p>
              {editing ? (
                <input value={editData.linkedIn ?? ''} onChange={(e) => setEditData((p) => ({ ...p, linkedIn: e.target.value }))} className="w-full px-2.5 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              ) : member.linkedIn ? (
                <a href={`https://${member.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                  Profile <ExternalLink size={12} />
                </a>
              ) : <p className="text-sm text-slate-400">—</p>}
            </div>
          </div>

          {/* Interests */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Interests</p>
            <div className="flex flex-wrap gap-1.5">
              {member.interests.map((i) => (
                <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">{i}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline + Owner + AI */}
        <div className="lg:col-span-2 space-y-5">
          {/* Owner & Next Action */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Owner & Next Action</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Assigned Owner</p>
                {editing ? (
                  <input value={editData.ownerName ?? ''} onChange={(e) => setEditData((p) => ({ ...p, ownerName: e.target.value }))} placeholder="Community Manager Name" className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                ) : <p className="text-sm font-semibold text-slate-800">{member.ownerName || '—'}</p>}
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Next Action Due</p>
                {editing ? (
                  <input type="date" value={editData.nextActionDue ?? ''} onChange={(e) => setEditData((p) => ({ ...p, nextActionDue: e.target.value }))} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                ) : <p className="text-sm font-semibold text-slate-800">{member.nextActionDue || '—'}</p>}
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-400 mb-1">Next Action</p>
                {editing ? (
                  <input value={editData.nextAction ?? ''} onChange={(e) => setEditData((p) => ({ ...p, nextAction: e.target.value }))} placeholder="e.g. Schedule check-in call" className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                ) : <p className="text-sm font-semibold text-slate-800">{member.nextAction || '—'}</p>}
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-400 mb-1">Internal Notes</p>
                {editing ? (
                  <textarea value={editData.notes ?? ''} onChange={(e) => setEditData((p) => ({ ...p, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
                ) : <p className="text-sm text-slate-700">{member.notes || '—'}</p>}
              </div>
            </div>
          </div>

          {/* AI Assist Panel */}
          <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-violet-600" />
              <p className="text-sm font-extrabold text-violet-900">🤖 AI Assist</p>
              <span className="ml-auto text-xs bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full font-bold">SIMULATED</span>
            </div>
            <p className="text-xs text-violet-700 mb-3">
              Rule-based suggestions. No messages are sent automatically. All outputs require human review.
            </p>
            <div className="flex flex-wrap gap-2">
              {AI_ACTIONS.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => runAI(type)}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white border border-violet-200 text-violet-800 px-3 py-2 rounded-xl hover:bg-violet-50 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {icon} {label}
                </button>
              ))}
            </div>
            {aiLoading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-violet-700">
                <Loader2 size={15} className="animate-spin" />
                Generating suggestion…
              </div>
            )}
            {aiSuggestion && !aiLoading && (
              <div className="mt-4 bg-white rounded-xl border border-violet-100 p-4 shadow-sm">
                <p className="text-xs font-bold text-violet-700 mb-2">{aiSuggestion.label}</p>
                <pre className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-sans">{aiSuggestion.content}</pre>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 italic">{aiSuggestion.disclaimer}</p>
                </div>
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Activity size={15} className="text-emerald-500" /> Activity Timeline
              </p>
              <button
                onClick={() => setShowAddActivity(true)}
                className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 border border-emerald-200 px-2.5 py-1.5 rounded-xl cursor-pointer hover:bg-emerald-50"
              >
                <Plus size={12} /> Log Activity
              </button>
            </div>

            {member.allActivities.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {member.allActivities.map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <div className="w-0.5 bg-slate-100 mx-4 relative">
                      <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" />
                    </div>
                    <div className="flex-1 pb-4 border-b border-slate-50 last:border-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${EVENT_COLORS[act.type] ?? 'bg-slate-100 text-slate-700'}`}>
                            {act.type}
                          </span>
                          {act.commercialFlag && (
                            <span className="ml-1.5 text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold ring-1 ring-red-200">
                              ⚠️ Commercial Signal — Human Review Required
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{act.date}</span>
                      </div>
                      <p className="text-sm text-slate-700 mt-1">{act.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.space} · Logged by {act.loggedBy}</p>
                      {act.commercialFlag && act.commercialNote && (
                        <p className="text-xs bg-red-50 text-red-700 mt-1 p-2 rounded-lg border border-red-100">
                          {act.commercialNote}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Activity Modal */}
      {showAddActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">Log Activity</h2>
              <button onClick={() => setShowAddActivity(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Activity Type</label>
                <select value={newAct.type} onChange={(e) => setNewAct((p) => ({ ...p, type: e.target.value as ActivityEventType }))} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  {ALL_EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Community Space</label>
                <select value={newAct.space} onChange={(e) => setNewAct((p) => ({ ...p, space: e.target.value as CommunitySpace }))} className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                  {ALL_SPACES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Description *</label>
                <textarea value={newAct.description} onChange={(e) => setNewAct((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Describe the activity…" className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none" />
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                <label className="flex items-center gap-2 text-xs font-bold text-amber-800 cursor-pointer">
                  <input type="checkbox" checked={newAct.commercialFlag} onChange={(e) => setNewAct((p) => ({ ...p, commercialFlag: e.target.checked }))} className="accent-amber-500" />
                  ⚠️ Flag potential commercial signal (requires human review — kept separate from activity score)
                </label>
                {newAct.commercialFlag && (
                  <input value={newAct.commercialNote} onChange={(e) => setNewAct((p) => ({ ...p, commercialNote: e.target.value }))} placeholder="Describe the commercial signal…" className="w-full mt-2 px-3 py-2 text-xs rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
                )}
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-slate-100">
              <button onClick={() => setShowAddActivity(false)} className="flex-1 py-2.5 text-sm font-bold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button onClick={handleAddActivity} disabled={!newAct.description} className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer">Log Activity</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberDetail
