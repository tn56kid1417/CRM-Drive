/* eslint-disable react-hooks/purity */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, AlertTriangle } from 'lucide-react'
import { useMemberStore } from '../../store/memberStore'


const STATE_BADGE: Record<string, string> = {
  'At Risk': 'bg-amber-100 text-amber-800 ring-amber-200',
  'Dormant': 'bg-red-100 text-red-800 ring-red-200',
}

export const AtRiskDormant: React.FC = () => {
  const { getMembersWithState } = useMemberStore()
  const [tab, setTab] = useState<'At Risk' | 'Dormant'>('At Risk')

  const allAtRisk = getMembersWithState().filter((m) => m.activityState === 'At Risk')
  const allDormant = getMembersWithState().filter((m) => m.activityState === 'Dormant')

  const members = tab === 'At Risk' ? allAtRisk : allDormant
  const today = Date.now()

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">At-Risk & Dormant Members</h1>
        <p className="text-sm text-slate-500 mt-1">Re-engagement view for disengaging members</p>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-sm text-amber-800 space-y-1">
        <p><strong>At Risk:</strong> Last activity 31–60 days ago. Warm outreach recommended.</p>
        <p><strong>Dormant:</strong> Last activity &gt; 60 days ago, or never active &gt; 14 days after joining. Personal re-engagement needed.</p>
        <p className="text-xs mt-1 text-amber-700">⚠️ Use genuine, community-first messaging. Do not use commercial language or treat engagement as buying intent.</p>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-2">
        {(['At Risk', 'Dormant'] as const).map((t) => {
          const count = t === 'At Risk' ? allAtRisk.length : allDormant.length
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-colors cursor-pointer border ${
                tab === t
                  ? t === 'At Risk'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t} <span className="ml-1 opacity-80">({count})</span>
            </button>
          )
        })}
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <p className="text-3xl mb-3">✅</p>
          <p className="text-lg font-bold text-slate-700">No {tab.toLowerCase()} members</p>
          <p className="text-sm text-slate-500 mt-1">Excellent community engagement!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {members
            .sort((a, b) => {
              const dA = a.lastActivityDate ? new Date(a.lastActivityDate).getTime() : 0
              const dB = b.lastActivityDate ? new Date(b.lastActivityDate).getTime() : 0
              return dA - dB // Most dormant first
            })
            .map((m) => {
              const daysSince = m.lastActivityDate
                ? Math.round((today - new Date(m.lastActivityDate).getTime()) / 86_400_000)
                : null

              return (
                <div key={m.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${m.avatarColor}`}>
                      {m.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-800">{m.name}</p>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ring-1 ${STATE_BADGE[m.activityState]}`}>
                          {m.activityState}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{m.role} · {m.primarySpace}</p>

                      {/* Days counter */}
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock size={12} className="text-slate-400" />
                        <p className="text-xs text-slate-600">
                          {daysSince !== null
                            ? <><strong className="text-red-600">{daysSince} days</strong> since last activity</>
                            : <span className="text-slate-400">No activity on record</span>
                          }
                        </p>
                      </div>

                      {/* Interests for messaging context */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {m.interests.slice(0, 3).map((i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{i}</span>
                        ))}
                      </div>

                      {/* Re-engagement hint */}
                      <div className="mt-3 text-xs text-slate-600 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                        <AlertTriangle size={11} className="inline mr-1 text-amber-500" />
                        <strong>Suggested action:</strong>{' '}
                        {m.activityState === 'Dormant'
                          ? `Send a personal check-in via LinkedIn or email. Reference their interest in ${m.interests[0] ?? 'the community'}. Keep tone warm and non-commercial.`
                          : `Send a warm channel mention or direct message referencing ${m.primarySpace}. Do not use sales language.`}
                      </div>

                      {m.ownerName && (
                        <p className="text-xs text-slate-400 mt-2">Owner: {m.ownerName}</p>
                      )}
                    </div>
                    <Link to={`/members/${m.id}`} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex-shrink-0">
                      View <ChevronRight size={13} />
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

export default AtRiskDormant
