import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { ThemeProvider } from '@mui/material/styles'
import { loginTheme, loginStyles } from '../styles/loginPageStyles'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const navigate = useNavigate()
  const login = useAuthStore(state => state.login)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isEmailValid = validateEmail(email)
    const isPasswordValid = validatePassword(password)
    
    if (!isEmailValid || !isPasswordValid) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Token`, {
        email,
        password
      })

      const { token, role } = response.data
      login(token, role)

      if (role === 2) {
        navigate('/staff-dashboard')
      } else if (role === 1) {
        navigate('/user-dashboard')
      }
    } catch (err: any) {
      setError(err.response?.data || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={loginTheme}>
      <Box sx={loginStyles.container}>
        <Container maxWidth="sm">
          <Card sx={loginStyles.card}>
            <CardContent sx={loginStyles.cardContent}>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Login
              </Typography>
              
              {error && (
                <Alert severity="error" sx={loginStyles.alert}>
                  {error}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={loginStyles.form}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  error={!!passwordError}
                  helperText={passwordError}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || emailError !== '' || passwordError !== ''}
                  sx={loginStyles.button}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={loginStyles.loadingIcon} />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/signup')}
                  sx={loginStyles.loadingIcon}
                >
                  Don't have an account? Sign Up
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default LoginPage