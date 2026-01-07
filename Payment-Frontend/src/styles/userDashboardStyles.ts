import { styled } from '@mui/material/styles'
import { Box, Card, Paper, AppBar, Toolbar, Button } from '@mui/material'

export const StyledAppBar = styled(AppBar)(() => ({
  marginBottom: 0,
  width: '100%',
  backgroundColor: '#1e3c72',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}))

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
  width: '100%',
  boxSizing: 'border-box'
}))

export const HeaderLeft = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center'
}))

export const LogoutButton = styled(Button)(() => ({
  borderColor: 'rgba(255, 255, 255, 0.5)',
  padding: '6px 16px',
  minWidth: 'fit-content',
  width: 'auto',
  flexShrink: 0,
  textTransform: 'none',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}))

export const UserDashboardContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  maxHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
  width: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
}))

export const HeaderSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center'
}))

export const PaymentCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  boxSizing: 'border-box'
}))

export const TransactionCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  width: '100%',
  marginBottom: theme.spacing(3),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  boxSizing: 'border-box'
}))

export const PaymentForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3)
}))

export const SimulationSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#f8f9fa',
  border: '1px solid #e0e0e0'
}))

export const TransactionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: '1px solid #e0e0e0',
  '&:last-child': {
    borderBottom: 'none'
  }
}))

export const AmountDisplay = styled(Box)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: theme.palette.primary.main
}))

export const StatusIndicator = styled(Box)<{ status: string }>(({ theme, status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.875rem',
  fontWeight: 500,
  backgroundColor:
    status === 'SUCCESS' ? '#e8f5e8' :
      status === 'FAILED' ? '#ffebee' : '#ffebee', // Default to failed styling
  color:
    status === 'SUCCESS' ? '#2e7d32' :
      status === 'FAILED' ? '#d32f2f' : '#d32f2f' // Default to failed color
}))

export const PayButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#1e3c72',
  color: 'white',
  padding: theme.spacing(1.5, 4),
  fontSize: '1rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#16305a'
  },
  '&:disabled': {
    backgroundColor: 'rgba(30, 60, 114, 0.5)',
    color: 'rgba(255, 255, 255, 0.7)'
  }
}))