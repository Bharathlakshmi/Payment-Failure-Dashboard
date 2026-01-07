import React from 'react'
import { Alert, AlertTitle, Box, Button } from '@mui/material'
import { RefreshOutlined } from '@mui/icons-material'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Alert severity="error">
            <AlertTitle>Something went wrong</AlertTitle>
            {this.state.error?.message || 'An unexpected error occurred'}
            <Box sx={{ mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RefreshOutlined />}
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Button>
            </Box>
          </Alert>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary