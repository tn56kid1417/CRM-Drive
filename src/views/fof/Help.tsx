import React, { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface Section {
  id: string
  title: string
  content: React.ReactNode
}

const Accordion: React.FC<{ section: Section }> = ({ section }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span className="font-bold text-slate-800">{section.title}</span>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-slate-50 text-sm text-slate-600 leading-relaxed">
          {section.content}
        </div>
      )}
    </div>
  )
}

const SECTIONS: Section[] = [
  {
    id: 'tool',
    title: '🛠️ Tool Used',
    content: (
      <div className="space-y-2 pt-3">
        <p><strong>Framework:</strong> React 19 + TypeScript with Vite build tooling.</p>
        <p><strong>Styling:</strong> Tailwind CSS v4 with a custom design token system (Outfit font, emerald/violet palette).</p>
        <p><strong>State management:</strong> Zustand with localStorage persistence — no backend required. All data lives in browser storage.</p>
        <p><strong>Charts:</strong> Recharts (bar + pie charts on the dashboard).</p>
        <p><strong>Deployment:</strong> The app runs fully in-browser as a Vite SPA. Run <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">npm run dev</code> to start locally, or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">npm run build</code> to produce a deployable bundle.</p>
        <p><strong>Login:</strong> Hardcoded community manager credentials — no API needed. Credentials: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">priya@friendsoffinance.com / fof2025</code> (also james@ and sophie@).</p>
      </div>
    ),
  },
  {
    id: 'rules',
    title: '📊 Activity-State Classification Rules',
    content: (
      <div className="pt-3 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200">State</th>
              <th className="text-left px-3 py-2 font-bold text-slate-700 border border-slate-200">Rule</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Newly Joined', 'Joined ≤ 14 days ago — regardless of activity. Onboarding focus.'],
              ['Highly Active', '≥ 4 activity events in the last 30 days (evaluated after Newly Joined).'],
              ['Active', '≥ 1 event in the last 30 days AND joined > 14 days ago.'],
              ['At Risk', 'Last activity was 31–60 days ago. No events in last 30 days.'],
              ['Dormant', 'Last activity > 60 days ago, OR never had any activity and joined > 14 days ago.'],
            ].map(([state, rule]) => (
              <tr key={state} className="even:bg-slate-50/50">
                <td className="px-3 py-2 font-semibold border border-slate-200">{state}</td>
                <td className="px-3 py-2 border border-slate-200">{rule}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-xs text-slate-500">States are recomputed live from the activity log. Newly Joined takes precedence over all other states. Highly Active is evaluated before Active.</p>
        <p className="mt-2 text-xs text-slate-500"><strong>Activity events counted:</strong> Post in channel, Reply/comment, Event RSVP, Event attended, Resource downloaded, Peer intro accepted, Welcome call, Poll responded, Direct message, Community call attended.</p>
      </div>
    ),
  },
  {
    id: 'ai',
    title: '🤖 AI Feature Explanation',
    content: (
      <div className="space-y-2 pt-3">
        <p className="font-semibold text-violet-700">Status: SIMULATED (clearly labelled in the UI)</p>
        <p>The AI Assist panel on each Member Detail page offers five types of suggestions:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Activity Summary</strong> — Generates a plain-text summary of recent activity events.</li>
          <li><strong>Suggest Space</strong> — Recommends community spaces based on the member's stated interests.</li>
          <li><strong>Suggest Peer Intro</strong> — Matches the member with other active members sharing a space or interest.</li>
          <li><strong>Draft Activation Message</strong> — Produces a warm, non-commercial re-engagement message template.</li>
          <li><strong>Recommend Next Step</strong> — Provides a state-appropriate next action for the community manager.</li>
        </ul>
        <p className="mt-2">These suggestions are generated by a deterministic rule-based function in the browser — not a live AI model or API. Every output is labelled <strong>[SIMULATED]</strong> in the UI.</p>
      </div>
    ),
  },
  {
    id: 'safeguards',
    title: '🛡️ Safeguards & Ethics',
    content: (
      <div className="space-y-2 pt-3">
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No auto-send:</strong> The AI Assist feature never sends any message automatically. All output requires a human community manager to review and act.</li>
          <li><strong>Activity score purity:</strong> The activity score is computed only from community participation events (posts, replies, RSVPs, downloads, etc.). It never includes commercial signals such as pricing enquiries.</li>
          <li><strong>Commercial signal separation:</strong> When logging an activity, the community manager can optionally flag a potential commercial signal (e.g., "asked about pricing"). This is stored in a separate field, displayed with a ⚠️ warning, and explicitly marked as requiring human review. It has no effect on the activity score or member state.</li>
          <li><strong>No personalisation invented:</strong> AI suggestions are based only on data explicitly entered into the CRM — interests, role, space, and activity events. Nothing is inferred or fabricated.</li>
          <li><strong>Engagement ≠ buying intent:</strong> All re-engagement messaging guidance is community-first. No suggestion treats activity as a commercial opportunity.</li>
          <li><strong>Community-first tone:</strong> All suggested messages reference community resources and shared interests, not products or services.</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'testing',
    title: '🧪 Testing Steps',
    content: (
      <div className="space-y-3 pt-3">
        <p className="font-semibold text-slate-700">To test the CRM manually:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Run <code className="bg-slate-100 px-1 rounded text-xs">npm run dev</code> and open <code className="bg-slate-100 px-1 rounded text-xs">localhost:5173</code>.</li>
          <li>Log in with <code className="bg-slate-100 px-1 rounded text-xs">priya@friendsoffinance.com / fof2025</code>.</li>
          <li><strong>Overview:</strong> Verify KPI tiles, bar chart, pie chart, and activity feed all display correct data.</li>
          <li><strong>Members:</strong> Search for "Aisha", filter by "Highly Active", filter by "#tools-and-tech". Verify results match.</li>
          <li><strong>Add Member:</strong> Click "Add Member", fill in name + email, click Add. Verify they appear in the table with state "Newly Joined".</li>
          <li><strong>Member Detail:</strong> Open any member. Click Edit → update Next Action → Save. Verify changes persist on refresh.</li>
          <li><strong>Log Activity:</strong> In a member's detail view, click "Log Activity". Add an event. Verify it appears in the timeline and the activity count updates.</li>
          <li><strong>AI Assist:</strong> Click any AI Assist button. Verify the output is labelled [SIMULATED] and contains a disclaimer. Verify no message is sent.</li>
          <li><strong>Commercial Flag:</strong> Log an activity and tick the commercial signal checkbox. Verify the timeline shows a ⚠️ Human Review Required badge.</li>
          <li><strong>Follow-up Queue:</strong> Navigate to Follow-up Queue. Verify At Risk and Dormant members appear. Verify priorities are correct.</li>
          <li><strong>New Members:</strong> Verify newly joined members show their onboarding checklist progress.</li>
          <li><strong>At-Risk / Dormant:</strong> Switch tabs. Verify correct members appear and days-since counters are accurate.</li>
          <li><strong>State classification:</strong> Add activities for a Dormant member until count30d ≥ 1 → verify state changes to Active; add to ≥ 4 → verify Highly Active.</li>
        </ol>
        <p className="text-xs text-slate-500 mt-2">Data persists in localStorage. To reset to seed data, open DevTools → Application → Local Storage → delete <code>fof-crm-store</code> and refresh.</p>
      </div>
    ),
  },
]

export const Help: React.FC = () => {
  return (
    <div className="space-y-5 animate-slide-up max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <HelpCircle size={20} className="text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Help & Guide</h1>
          <p className="text-sm text-slate-500 mt-0.5">Everything you need to use the FoF Community CRM</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-sm text-emerald-800">
        <strong>Friends of Finance Community CRM</strong> — a purpose-built tool for community managers to track member engagement, classify activity states, assign follow-up actions, and use AI-assisted suggestions to support members effectively and ethically.
      </div>

      <div className="space-y-3">
        {SECTIONS.map((s) => <Accordion key={s.id} section={s} />)}
      </div>
    </div>
  )
}

export default Help
