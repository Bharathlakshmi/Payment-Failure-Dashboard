import React from 'react'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Assessment as AnalyticsIcon,
  ErrorOutline as FailuresIcon,
  Settings as SettingsIcon,
  List as TransactionsIcon
} from '@mui/icons-material'

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <DashboardIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'failures', label: 'Failed Transactions', icon: <FailuresIcon /> },
    { id: 'transactions', label: 'All Transactions', icon: <TransactionsIcon /> },
    { id: 'simulation', label: 'Failure Simulation', icon: <SettingsIcon /> }
  ]

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1976d2' }}>
        Payment Dashboard
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  backgroundColor: '#e3f2fd',
                  '&:hover': {
                    backgroundColor: '#e3f2fd'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: activeSection === item.id ? '#1976d2' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: activeSection === item.id ? 600 : 400
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}