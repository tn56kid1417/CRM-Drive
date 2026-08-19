/* eslint-disable react-hooks/purity */
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ArrowRight } from 'lucide-react'
import { useMemberStore } from '../../store/memberStore'

const PRIORITY_BADGE: Record<string, string> = {
  High: 'bg-red-100 text-red-700 ring-red-200',
  Medium: 'bg-amber-100 text-amber-700 ring-amber-200',
  Low: 'bg-slate-100 text-slate-600 ring-slate-200',
}

export const FollowUp: React.FC = () => {
  const { getMembersWithState } = useMemberStore()
  const members = getMembersWithState()

  const items = useMemo(() => {
    const list: {
      member: typeof members[0]
      reason: string
      priority: 'High' | 'Medium' | 'Low'
      daysSince?: number
      daysOverdue?: number
    }[] = []

    const today = Date.now()

    members.forEach((m) => {
      // At Risk / Dormant
      if (m.activityState === 'Dormant') {
        const daysSince = m.lastActivityDate
          ? Math.round((today - new Date(m.lastActivityDate).getTime()) / 86_400_000)
          : null
        list.push({
          member: m,
          reason: `Dormant — ${daysSince ? `${daysSince} days` : 'no'} since last activity`,
          priority: 'High',
          daysSince: daysSince ?? undefined,
        })
      } else if (m.activityState === 'At Risk') {
        const daysSince = m.lastActivityDate
          ? Math.round((today - new Date(m.lastActivityDate).getTime()) / 86_400_000)
          : null
        list.push({
          member: m,
          reason: `At Risk — ${daysSince ? `${daysSince} days` : 'no'} since last activity`,
          priority: 'Medium',
          daysSince: daysSince ?? undefined,
        })
      }

      // Overdue next actions (all states)
      if (m.nextActionDue) {
        const due = new Date(m.nextActionDue).getTime()
        const daysOverdue = Math.round((today - due) / 86_400_000)
        if (daysOverdue > 0 && m.activityState !== 'Dormant' && m.activityState !== 'At Risk') {
          list.push({
            member: m,
            reason: `Next action overdue by ${daysOverdue} day${daysOverdue === 1 ? '' : 's'}: "${m.nextAction}"`,
            priority: daysOverdue >= 7 ? 'High' : 'Medium',
            daysOverdue,
          })
        }
      }

      // Newly joined without welcome call after 5 days
      if (m.activityState === 'Newly Joined' && !m.welcomeCallDone) {
        const daysSince = Math.round((today - new Date(m.joinDate).getTime()) / 86_400_000)
        if (daysSince >= 5) {
          list.push({
            member: m,
            reason: `Newly joined ${daysSince} days ago — welcome call not completed`,
            priority: 'Medium',
          })
        }
      }
    })

    // Deduplicate by member id + reason
    const seen = new Set<string>()
    return list
      .filter((i) => {
        const key = `${i.member.id}-${i.priority}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a, b) => {
        const p = { High: 0, Medium: 1, Low: 2 }
        return p[a.priority] - p[b.priority]
      })
  }, [members])

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Follow-up Queue</h1>
        <p className="text-sm text-slate-500 mt-1">
          Members needing attention · <strong>{items.length}</strong> items
        </p>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-3">
        {(['High', 'Medium', 'Low'] as const).map((p) => {
          const count = items.filter((i) => i.priority === p).length
          return (
            <div key={p} className={`px-3 py-1.5 rounded-full text-xs font-bold ring-1 ${PRIORITY_BADGE[p]}`}>
              {p} Priority · {count}
            </div>
          )
        })}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
          <p className="text-3xl mb-3">🎉</p>
          <p className="text-lg font-bold text-slate-700">All caught up!</p>
          <p className="text-sm text-slate-500 mt-1">No members currently need follow-up. Great work!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={`${item.member.id}-${idx}`} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 ${item.member.avatarColor}`}>
                  {item.member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-800">{item.member.name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ring-1 ${PRIORITY_BADGE[item.priority]}`}>
                      {item.priority}
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                      {item.member.activityState}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{item.reason}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
                    <span>{item.member.role}</span>
                    <span>{item.member.primarySpace}</span>
                    {item.member.ownerName && <span>Owner: {item.member.ownerName}</span>}
                  </div>
                  {item.member.nextAction && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-lg">
                      <ArrowRight size={11} className="mt-0.5 text-slate-400 flex-shrink-0" />
                      <span><strong>Next:</strong> {item.member.nextAction}</span>
                    </div>
                  )}
                </div>
                <Link
                  to={`/members/${item.member.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex-shrink-0"
                >
                  View <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FollowUp
