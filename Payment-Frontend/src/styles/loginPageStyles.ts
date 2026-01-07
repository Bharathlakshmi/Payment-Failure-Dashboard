import { createTheme } from '@mui/material/styles'

export const loginTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
})

export const loginStyles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#1e3c72',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2
  },
  card: {
    maxWidth: 400,
    mx: 'auto',
    boxShadow: 3
  },
  cardContent: {
    p: 4
  },
  alert: {
    mb: 2
  },
  form: {
    mt: 2
  },
  button: {
    mt: 3,
    mb: 2,
    py: 1.5
  },
  loadingIcon: {
    mr: 1
  }
}