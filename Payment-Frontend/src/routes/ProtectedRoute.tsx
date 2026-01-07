
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { JSX } from 'react/jsx-runtime'

type Props = {
  children: JSX.Element
  requiredRole?: string
}

export function ProtectedRoute({ children, requiredRole }: Props) {
  const token = useAuthStore(state => state.token)
  const role = useAuthStore(state => state.role)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && String(role) !== String(requiredRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}