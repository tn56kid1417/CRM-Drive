import React from 'react'
import { useAuthStore } from '../store/authStore'
import CompanyAdminDashboard from '../views/company-admin/Dashboard'
import SalesUserDashboard from '../views/sales-user/Dashboard'

export const DashboardDispatcher: React.FC = () => {
  const { user } = useAuthStore()

  if (user?.role === 'COMPANY_ADMIN') {
    return <CompanyAdminDashboard />
  }

  return <SalesUserDashboard />
}
export default DashboardDispatcher
