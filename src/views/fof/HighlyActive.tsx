import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, Zap } from 'lucide-react'
import { useMemberStore } from '../../store/memberStore'

export const HighlyActive: React.FC = () => {
  const { getMembersWithState } = useMemberStore()
  const members = getMembersWithState()
    .filter((m) => m.activityState === 'Highly Active')
    .sort((a, b) => b.activityCount30d - a.activityCount30d)

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Highly Active Members</h1>
        <p className="text-sm text-slate-500 mt-1">Members with ≥ 4 activity events in the last 30 days · <strong>{members.length}</strong> total</p>
      </div>

      <div className="bg-violet-50 border border-violet-200 rounded-2xl px-5 py-4 text-sm text-violet-800">
        <strong>Power member tip:</strong> Highly active members are great candidates for community spotlights, peer introduction facilitation, co-hosting events, or becoming formal mentors.
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <p className="text-3xl mb-3">🌟</p>
          <p className="text-lg font-bold text-slate-700">No highly active members yet</p>
          <p className="text-sm text-slate-500 mt-1">Members with 4+ events in 30 days appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              {i < 3 && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star size={11} className="fill-amber-500 text-amber-500" />
                  #{i + 1}
                </div>
              )}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ${m.avatarColor}`}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{m.name}</p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                  <p className="text-xs text-slate-400 font-mono">{m.primarySpace}</p>
                </div>
              </div>

              {/* Activity Count Highlight */}
              <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 mb-4">
                <Zap size={16} className="text-violet-600" />
                <div>
                  <p className="text-2xl font-extrabold text-violet-800">{m.activityCount30d}</p>
                  <p className="text-xs text-violet-600">events in last 30 days</p>
                </div>
              </div>

              {/* Interests */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {m.interests.slice(0, 3).map((i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{i}</span>
                ))}
              </div>

              {/* Recent Activity */}
              {m.recentActivities.length > 0 && (
                <div className="mb-4 space-y-1.5">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent</p>
                  {m.recentActivities.slice(0, 2).map((a) => (
                    <p key={a.id} className="text-xs text-slate-600">
                      <span className="font-semibold">{a.type}</span> in {a.space}
                    </p>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              <div className="mb-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement Ideas</p>
                {m.allActivities.length >= 8 && <p className="text-xs text-emerald-700">• Feature in community spotlight</p>}
                {m.role === 'Mentor' || m.role === 'Senior Professional' ? (
                  <p className="text-xs text-emerald-700">• Invite to co-host a session</p>
                ) : (
                  <p className="text-xs text-emerald-700">• Facilitate a peer introduction</p>
                )}
                <p className="text-xs text-emerald-700">• Ask for a community testimonial</p>
              </div>

              <Link to={`/members/${m.id}`} className="flex items-center justify-between text-xs font-bold text-emerald-600 hover:text-emerald-800">
                View Profile <ChevronRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HighlyActive
