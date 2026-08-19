import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Star,
  UserPlus,
  Bell,
  HelpCircle,
} from 'lucide-react'

export interface NavItem {
  name: string
  href: string
  icon: any
}

export const SIDEBAR_NAV: NavItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'All Members', href: '/members', icon: Users },
  { name: 'Follow-up Queue', href: '/follow-up', icon: Bell },
  { name: 'New Members', href: '/new-members', icon: UserPlus },
  { name: 'Highly Active', href: '/highly-active', icon: Star },
  { name: 'At-Risk / Dormant', href: '/at-risk', icon: AlertTriangle },
  { name: 'Help & Guide', href: '/help', icon: HelpCircle },
]

export default SIDEBAR_NAV
