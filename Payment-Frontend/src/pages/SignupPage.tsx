import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { signupTheme, signupStyles } from '../styles/signupPageStyles'

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const navigate = useNavigate()

  const validateName = (name: string) => {
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Name is required' }))
      return false
    }
    if (name.trim().length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }))
      return false
    }
    setErrors(prev => ({ ...prev, name: '' }))
    return true
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }))
      return false
    }
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
      return false
    }
    setErrors(prev => ({ ...prev, email: '' }))
    return true
  }

  const validatePassword = (password: string) => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }))
      return false
    }
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }))
      return false
    }
    if (!/(?=.*[a-z])/.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one lowercase letter' }))
      return false
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one uppercase letter' }))
      return false
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      setErrors(prev => ({ ...prev, password: 'Password must contain at least one special character' }))
      return false
    }
    setErrors(prev => ({ ...prev, password: '' }))
    return true
  }

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Please confirm your password' }))
      return false
    }
    if (confirmPassword !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      return false
    }
    setErrors(prev => ({ ...prev, confirmPassword: '' }))
    return true
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, [field]: value }))

    switch (field) {
      case 'name':
        validateName(value)
        break
      case 'email':
        validateEmail(value)
        break
      case 'password':
        validatePassword(value)
        if (formData.confirmPassword) {
          validateConfirmPassword(formData.confirmPassword, value)
        }
        break
      case 'confirmPassword':
        validateConfirmPassword(value, formData.password)
        break
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isNameValid = validateName(formData.name)
    const isEmailValid = validateEmail(formData.email)
    const isPasswordValid = validatePassword(formData.password)
    const isConfirmPasswordValid = validateConfirmPassword(formData.confirmPassword, formData.password)
    
    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/User`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 1
      })

      setSuccess('Registration successful! You can now login.')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = () => {
    return Object.values(errors).every(error => error === '') && 
           Object.values(formData).every(value => value.trim() !== '')
  }

  return (
    <ThemeProvider theme={signupTheme}>
      <Box sx={signupStyles.container}>
        <Container maxWidth="sm">
          <Card sx={signupStyles.card}>
            <CardContent sx={signupStyles.cardContent}>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Sign Up
              </Typography>
              
              {error && (
                <Alert severity="error" sx={signupStyles.alert}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={signupStyles.alert}>
                  {success}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={signupStyles.form}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  error={!!errors.password}
                  helperText={errors.password}
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

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange('confirmPassword')}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading || !isFormValid()}
                  sx={signupStyles.button}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={signupStyles.loadingIcon} />
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/login')}
                  sx={signupStyles.linkButton}
                >
                  Already have an account? Login
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default SignupPage