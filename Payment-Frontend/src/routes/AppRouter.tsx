
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import LandingPage from '../pages/LandingPage'
import StaffDashboard from '../pages/StaffDashboard'
import UserDashboard from '../pages/UserDashboard'
import { ProtectedRoute } from './ProtectedRoute'

const UnauthorizedPage = () => (
  <div style={{ textAlign: 'center', marginTop: '50px' }}>
    <h1>403 - Unauthorized</h1>
    <p>You don't have permission to access this page.</p>
  </div>
)

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute requiredRole="2">
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute requiredRole="1">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}