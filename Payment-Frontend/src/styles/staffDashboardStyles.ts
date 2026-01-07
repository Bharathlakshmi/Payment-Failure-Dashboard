import { styled } from '@mui/material/styles'
import { Box, Card, AppBar, Drawer, Toolbar, Button } from '@mui/material'

export const DashboardContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],
  width: '100%',
  overflowX: 'hidden'
}))

export const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  marginTop: '64px',
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(1.5)
  }
}))

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
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

export const LogoutButton = styled(Button)(({ theme }) => ({
  borderColor: 'rgba(255, 255, 255, 0.5)',
  padding: theme.spacing(0.5, 1.5),
  minWidth: 'fit-content',
  width: 'auto',
  flexShrink: 0,
  textTransform: 'none',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
}))

export const StyledDrawer = styled(Drawer)(({ theme: _theme }) => ({
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    backgroundColor: '#f8f9fa',
    borderRight: '1px solid #e0e0e0'
  }
}))

export const MetricCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
}))

export const ChartCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: 0,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}))

export const TableCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '100%',
  boxSizing: 'border-box'
}))

export const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
  alignItems: 'center'
}))

export const StatusChip = styled('span')<{ status: string }>(({ theme: _theme, status }) => ({
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  backgroundColor:
    status === 'SUCCESS' ? '#e8f5e8' :
      status === 'FAILED' ? '#ffebee' : '#fff3e0',
  color:
    status === 'SUCCESS' ? '#2e7d32' :
      status === 'FAILED' ? '#d32f2f' : '#f57c00'
}))

export const SimulationDecoration = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  minHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f1f4f9',
  borderRadius: theme.shape.borderRadius,
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid #e0e6ed',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: '-50%',
    left: '-50%',
    zIndex: 0,
    backgroundImage: `radial-gradient(${theme.palette.primary.main} 1px, transparent 1px)`,
    backgroundSize: '24px 24px',
    opacity: 0.1
  },
  '& > *': {
    position: 'relative',
    zIndex: 1
  }
}))