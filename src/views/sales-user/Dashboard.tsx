import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Award, DollarSign, CalendarCheck } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLeadStore } from '../../store/leadStore'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Table } from '../../components/ui/Table'
import type { Column } from '../../components/ui/Table'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { formatUSD, formatDate } from '../../utils/formatters'
import type { Lead } from '../../types'

export const SalesUserDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { leads, fetchLeads, isLoading } = useLeadStore()

  useEffect(() => {
    if (user) {
      fetchLeads({ assignedUserId: user.id })
    }
  }, [user])

  if (!user) return null

  // Calculate user-specific metrics
  const myLeads = leads
  const totalAssigned = myLeads.length
  const openLeads = myLeads.filter((l) => l.status !== 'Converted' && l.status !== 'Closed')
  const wonLeads = myLeads.filter((l) => l.status === 'Converted')
  const lostLeads = myLeads.filter((l) => l.status === 'Closed')

  const winRate = totalAssigned > 0 
    ? Math.round((wonLeads.length / (wonLeads.length + lostLeads.length || 1)) * 100) 
    : 0

  const closedWonRevenue = wonLeads.reduce((acc, l) => acc + l.value, 0)
  const openPipelineValue = openLeads.reduce((acc, l) => acc + l.value, 0)

  const stats = [
    {
      title: 'Assigned Deals',
      value: totalAssigned,
      description: `${openLeads.length} open prospects`,
      icon: ClipboardList,
      color: 'text-primary bg-primary/10 border-primary/20',
    },
    {
      title: 'Booked Sales',
      value: formatUSD(closedWonRevenue),
      description: `${wonLeads.length} won contracts`,
      icon: Award,
      color: 'text-success bg-success/10 border-success/20',
    },
    {
      title: 'Forecast Pipeline',
      value: formatUSD(openPipelineValue),
      description: 'Pending deal values',
      icon: DollarSign,
      color: 'text-info bg-info/10 border-info/20',
    },
    {
      title: 'Conversion Rate',
      value: `${winRate}%`,
      description: 'Wins vs outcomes',
      icon: CalendarCheck,
      color: 'text-warning bg-warning/10 border-warning/20',
    },
  ]

  const columns: Column<Lead>[] = [
    {
      header: 'Prospect Contact',
      accessor: (row) => (
        <div className="text-left">
          <h4 className="font-semibold text-slate-800 leading-snug">{row.name}</h4>
          <span className="text-xs text-slate-400 font-semibold">{row.companyName}</span>
        </div>
      ),
    },
    {
      header: 'Value',
      accessor: (row) => formatUSD(row.value),
    },
    {
      header: 'Stage Status',
      accessor: (row) => {
        const variants: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'> = {
          'New': 'secondary',
          'Contacted': 'info',
          'Follow-up': 'warning',
          'Converted': 'success',
          'Closed': 'danger',
        }
        return <Badge variant={variants[row.status] || 'primary'}>{row.status}</Badge>
      },
    },
    {
      header: 'Last Interaction',
      accessor: (row) => formatDate(row.updatedDate),
    },
  ]

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-sm font-medium text-slate-500">
            Welcome back, {user.name}. Track your deals pipeline and record client interactions.
          </p>
        </div>
        <Button onClick={() => navigate('/leads')} className="cursor-pointer shadow-sm">
          Launch Leads Panel
        </Button>
      </div>

      {/* Stats widgets grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} hoverEffect>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`p-3 rounded-xl border flex items-center justify-center ${stat.color}`}>
                  <Icon size={22} />
                </div>
                <div className="flex-1 text-left">
                  <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">{stat.title}</span>
                  <span className="text-2xl font-extrabold text-slate-800 block mt-0.5 tracking-tight">{stat.value}</span>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-0.5">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actionable Followups & Open Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Open leads column */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-bold text-left">My Active Leads</h3>
          <Table
            columns={columns}
            data={openLeads}
            isLoading={isLoading}
            rowClick={(row) => navigate(`/customers/${row.id}`)}
            emptyMessage="No pending leads currently allocated. Good job!"
          />
        </div>

        {/* Reminders calendar list */}
        <Card className="flex flex-col h-[350px]">
          <CardHeader>
            <CardTitle className="text-left flex items-center gap-2">
              <CalendarCheck size={18} className="text-warning" /> Follow Up Agenda
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {openLeads.filter(l => l.status === 'Follow-up').length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No scheduled follow-up agendas. Update a lead status to Follow-up to list here.
                </div>
              ) : (
                openLeads
                  .filter((l) => l.status === 'Follow-up')
                  .map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => navigate(`/customers/${lead.id}`)}
                      className="p-3 border border-slate-200 bg-slate-50/50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-850 leading-snug">{lead.name}</h4>
                        <Badge variant="warning" className="text-[9px] font-bold">Follow Up</Badge>
                      </div>
                      <p className="text-xs text-slate-500">{lead.companyName}</p>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                        Last edited: {formatDate(lead.updatedDate)}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
export default SalesUserDashboard
