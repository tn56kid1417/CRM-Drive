import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, CheckCircle, Circle, Phone } from 'lucide-react'
import { useMemberStore } from '../../store/memberStore'

export const NewMembers: React.FC = () => {
  const { getMembersWithState } = useMemberStore()
  const newMembers = getMembersWithState().filter((m) => m.activityState === 'Newly Joined')

  const today = Date.now()

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">New Members</h1>
        <p className="text-sm text-slate-500 mt-1">Members who joined in the last 14 days · <strong>{newMembers.length}</strong> total</p>
      </div>

      <div className="bg-cyan-50 border border-cyan-200 rounded-2xl px-5 py-4 text-sm text-cyan-800">
        <strong>Onboarding goal:</strong> Every new member should receive a welcome call within 5 days, be introduced to their primary community space, and have onboarding marked complete within 14 days.
      </div>

      {newMembers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <p className="text-3xl mb-3">👋</p>
          <p className="text-lg font-bold text-slate-700">No new members right now</p>
          <p className="text-sm text-slate-500 mt-1">Members who join will appear here for 14 days.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newMembers.map((m) => {
            const daysSinceJoin = Math.round((today - new Date(m.joinDate).getTime()) / 86_400_000)
            const urgentCall = !m.welcomeCallDone && daysSinceJoin >= 5
            return (
              <div key={m.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${m.avatarColor}`}>
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.role}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Joined {daysSinceJoin === 0 ? 'today' : `${daysSinceJoin} day${daysSinceJoin === 1 ? '' : 's'} ago`}</p>
                  </div>
                  <span className="text-xs bg-cyan-100 text-cyan-700 font-bold px-2.5 py-1 rounded-full flex-shrink-0">New</span>
                </div>

                {/* Onboarding Checklist */}
                <div className="space-y-2 mb-4">
                  {[
                    { label: 'Welcome call completed', done: !!m.welcomeCallDone },
                    { label: 'Introduced to primary space', done: m.allActivities.some((a) => a.space === m.primarySpace) },
                    { label: 'First post / interaction', done: m.allActivities.length > 0 },
                    { label: 'Onboarding complete', done: !!m.onboardingComplete },
                  ].map(({ label, done }) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      {done ? (
                        <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Circle size={13} className="text-slate-300 flex-shrink-0" />
                      )}
                      <span className={done ? 'text-slate-600' : 'text-slate-400'}>{label}</span>
                    </div>
                  ))}
                </div>

                {urgentCall && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-4 text-xs text-amber-800 font-semibold">
                    <Phone size={12} /> Welcome call overdue — joined {daysSinceJoin} days ago
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{m.primarySpace}</span>
                  <Link to={`/members/${m.id}`} className="flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-800">
                    View Profile <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NewMembers
