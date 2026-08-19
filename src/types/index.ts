// ─── Auth ──────────────────────────────────────────────────────────────────
export interface User {
  id: string
  name: string
  email: string
  role: 'COMMUNITY_MANAGER'
}

// ─── Community Spaces ───────────────────────────────────────────────────────
export type CommunitySpace =
  | '#introductions'
  | '#market-commentary'
  | '#resources-library'
  | '#events-calendar'
  | '#peer-intros'
  | '#job-board'
  | '#tools-and-tech'
  | '#general-chat'
  | '#study-groups'
  | '#alumni-network'

// ─── Activity State ─────────────────────────────────────────────────────────
export type ActivityState =
  | 'Newly Joined'
  | 'Active'
  | 'Highly Active'
  | 'At Risk'
  | 'Dormant'

// ─── Activity Event Types ────────────────────────────────────────────────────
export type ActivityEventType =
  | 'Post in channel'
  | 'Reply / comment'
  | 'Event RSVP'
  | 'Event attended'
  | 'Resource downloaded'
  | 'Peer intro accepted'
  | 'Welcome call'
  | 'Poll responded'
  | 'Direct message'
  | 'Community call attended'

// ─── Activity Event ──────────────────────────────────────────────────────────
export interface ActivityEvent {
  id: string
  memberId: string
  type: ActivityEventType
  space: CommunitySpace
  description: string
  date: string // ISO date string
  loggedBy: string // community manager name
  commercialFlag?: boolean // ⚠️ Requires human review – never feeds activity score
  commercialNote?: string  // Human-readable note about the commercial signal
}

// ─── Member ───────────────────────────────────────────────────────────────────
export type MemberRole =
  | 'Student'
  | 'Graduate'
  | 'Early Professional'
  | 'Mid-career Professional'
  | 'Senior Professional'
  | 'Mentor'
  | 'Alumni'

export interface Member {
  id: string
  name: string
  email: string
  phone?: string
  joinDate: string          // ISO date string
  role: MemberRole
  primarySpace: CommunitySpace
  interests: string[]
  bio?: string
  linkedIn?: string
  ownerId?: string          // Community manager assigned as owner
  ownerName?: string
  nextAction?: string
  nextActionDue?: string    // ISO date string
  onboardingComplete?: boolean
  welcomeCallDone?: boolean
  notes?: string
  avatarColor: string       // Tailwind bg color token for avatar
}

// ─── Computed member with state ───────────────────────────────────────────────
export interface MemberWithState extends Member {
  activityState: ActivityState
  activityCount30d: number  // Events in last 30 days
  lastActivityDate?: string
  recentActivities: ActivityEvent[]
  allActivities: ActivityEvent[]
}

// ─── Follow-up item ───────────────────────────────────────────────────────────
export interface FollowUpItem {
  member: MemberWithState
  reason: string
  priority: 'High' | 'Medium' | 'Low'
  daysSinceActivity?: number
  daysUntilActionDue?: number
}

// ─── AI Suggestion ────────────────────────────────────────────────────────────
export type AISuggestionType =
  | 'activity_summary'
  | 'space_suggestion'
  | 'peer_intro'
  | 'activation_message'
  | 'next_step'

export interface AISuggestion {
  type: AISuggestionType
  label: string
  content: string
  disclaimer: string
}
