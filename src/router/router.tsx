import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Layouts
import DashboardLayout from '../layouts/DashboardLayout'
import AuthLayout from '../layouts/AuthLayout'

// FoF Views
import Login from '../views/fof/Login'
import Dashboard from '../views/fof/Dashboard'
import Members from '../views/fof/Members'
import MemberDetail from '../views/fof/MemberDetail'
import FollowUp from '../views/fof/FollowUp'
import NewMembers from '../views/fof/NewMembers'
import HighlyActive from '../views/fof/HighlyActive'
import AtRiskDormant from '../views/fof/AtRiskDormant'
import Help from '../views/fof/Help'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Dashboard */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/members/:id" element={<MemberDetail />} />
          <Route path="/follow-up" element={<FollowUp />} />
          <Route path="/new-members" element={<NewMembers />} />
          <Route path="/highly-active" element={<HighlyActive />} />
          <Route path="/at-risk" element={<AtRiskDormant />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
