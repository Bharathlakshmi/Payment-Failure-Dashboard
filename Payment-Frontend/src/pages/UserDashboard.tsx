import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Divider,
  List,
  Snackbar
} from '@mui/material'
import {
  LogoutOutlined,
  PaymentOutlined,
  HistoryOutlined,
  BugReportOutlined,
  CheckCircleOutlined,
  ErrorOutlined
} from '@mui/icons-material'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { paymentService } from '../services/paymentService'
import type { PaymentTransaction, PaymentRequest } from '../types/payment'
import {
  UserDashboardContainer,
  PaymentCard,
  TransactionCard,
  PaymentForm,
  SimulationSection,
  TransactionItem,
  AmountDisplay,
  StatusIndicator,
  StyledAppBar,
  StyledToolbar,
  HeaderLeft,
  LogoutButton,
  PayButton
} from '../styles/userDashboardStyles'

const UserDashboard: React.FC = () => {
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentRequest>({
    amount: 100,
    currency: 'INR',
    channel: 'UPI',
    gateway: 'razorpay',
    bank: ''
  })
  const [simulationEnabled, setSimulationEnabled] = useState(false)

  useEffect(() => {
    loadTransactions()
    loadNetworkConfig()

    // Listen for payment success events
    const handlePaymentSuccess = () => {
      setTimeout(() => loadTransactions(), 1000)
    }

    window.addEventListener('payment-success', handlePaymentSuccess)

    return () => {
      window.removeEventListener('payment-success', handlePaymentSuccess)
    }
  }, [])

  const loadTransactions = async () => {
    setLoading(true)
    try {
      const userTransactions = await paymentService.getUserTransactions()
      setTransactions(userTransactions)
    } catch (err) {
      setError('Failed to load transactions')
      console.error('Error loading transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadNetworkConfig = async () => {
    try {
      const config = await paymentService.getNetworkFailureConfig()
      setSimulationEnabled(config.enabled)
    } catch (err) {
      console.error('Error loading network config:', err)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentLoading(true)
    setError(null)

    try {
      const result = await paymentService.initiatePayment(paymentData)

      if (result.gateway === 'razorpay') {
        const options = {
          key: result.razorpayKeyId,
          amount: result.amount * 100, // Amount is in currency subunits (paise)
          currency: result.currency || 'INR',
          name: 'Payment Failure Dashboard',
          description: 'Payment Transaction',
          handler: async (response: any) => {
            console.log('Payment Success Response:', response)

            // Update status on success
            await paymentService.updatePaymentStatus(result.id, 'SUCCESS')

            setSuccess(`Payment successful! ID: ${result.id}`)
            window.dispatchEvent(new CustomEvent('payment-success'))
            await loadTransactions()
            setPaymentLoading(false)
          },
          prefill: {
            name: 'User Name',
            email: 'user@example.com'
          },
          theme: {
            color: '#3f51b5'
          },
          modal: {
            ondismiss: async function () {
              try {
                // Record the cancelled payment as failed
                await paymentService.updatePaymentStatus(
                  result.id,
                  'FAILED',
                  'USER_CANCELLED',
                  'Payment cancelled by user',
                  'payment'
                )

                // Small delay to ensure backend processing completes
                await new Promise(resolve => setTimeout(resolve, 300))

                // Reload transactions to show the updated status
                await loadTransactions()
              } catch (err) {
                console.error('Error updating cancelled payment status:', err)
              }

              // Show error message to user
              setError('Payment cancelled by user')
              setPaymentLoading(false)
            }
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()

        // Load transactions immediately to show the PENDING payment
        await loadTransactions()
      } else {
        const message = result.status === 'SUCCESS' ? 'Payment successful' : 'Payment failed'
        setSuccess(`${message}: ${result.id}`)
        await loadTransactions()
      }

      // Reset form
      setPaymentData({
        amount: 100,
        currency: 'INR',
        channel: 'UPI',
        gateway: 'razorpay',
        bank: ''
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment initiation failed. Please try again.')
    } finally {
      // Don't set loading to false here for Razorpay - let ondismiss or handler do it
      // setPaymentLoading(false)
    }
  }

  const handleInputChange = (field: keyof PaymentRequest, value: string | number) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const simulateNetworkFailure = async (type: 'timeout' | 'system-error') => {
    setPaymentLoading(true)
    try {
      let result
      if (type === 'timeout') {
        result = await paymentService.simulateTimeout()
      } else {
        result = await paymentService.simulateSystemError()
      }
      setSuccess(`Simulated ${type} failure: ${result.id}`)
      await loadTransactions()
    } catch (err: any) {
      setError(`Failed to simulate ${type}: ${err.message}`)
    } finally {
      setPaymentLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircleOutlined sx={{ color: '#4caf50' }} />
      case 'FAILED':
      default:
        return <ErrorOutlined sx={{ color: '#f44336' }} />
    }
  }

  return (
    <UserDashboardContainer>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <HeaderLeft>
            <PaymentOutlined sx={{ mr: 2 }} />
            <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
              Payment Portal
            </Typography>
          </HeaderLeft>
          <LogoutButton
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </LogoutButton>
        </StyledToolbar>
      </StyledAppBar>

      <Box sx={{
        flexGrow: 1,
        pt: '80px',
        pb: 4,
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        height: 'calc(100vh - 80px)', // Adjust for fixed header
        overflowY: 'auto',
        boxSizing: 'border-box',
        msOverflowStyle: 'none', // IE and Edge
        scrollbarWidth: 'none', // Firefox
        '&::-webkit-scrollbar': {
          display: 'none' // Chrome, Safari and Opera
        }
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '3fr 6fr 3fr'
          },
          gap: 3,
          width: '100%'
        }}>
          {/* Payment Form Section */}
          <Box sx={{ minWidth: 0 }}>
            <PaymentCard sx={{ height: '520px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                Make a Payment
              </Typography>

              <PaymentForm onSubmit={handlePaymentSubmit}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                  }}
                  required
                />

                <TextField
                  fullWidth
                  select
                  label="Payment Channel"
                  value={paymentData.channel}
                  onChange={(e) => handleInputChange('channel', e.target.value)}
                  required
                >
                  <MenuItem value="WEB">Net Banking</MenuItem>
                  <MenuItem value="MOBILE">Wallets</MenuItem>
                  <MenuItem value="UPI">UPI</MenuItem>
                  <MenuItem value="CARDS">Cards</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Payment Gateway"
                  value={paymentData.gateway}
                  onChange={(e) => handleInputChange('gateway', e.target.value)}
                  required
                >
                  <MenuItem value="razorpay">Razorpay</MenuItem>
                </TextField>

                <TextField
                  select
                  label="Bank (Optional)"
                  value={paymentData.bank}
                  onChange={(e) => handleInputChange('bank', e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">Select Bank</MenuItem>
                  <MenuItem value="HDFC">HDFC Bank</MenuItem>
                  <MenuItem value="ICICI">ICICI Bank</MenuItem>
                  <MenuItem value="SBI">State Bank of India</MenuItem>
                  <MenuItem value="AXIS">Axis Bank</MenuItem>
                  <MenuItem value="KOTAK">Kotak Mahindra Bank</MenuItem>
                  <MenuItem value="INDUSIND">IndusInd Bank</MenuItem>
                  <MenuItem value="YES">Yes Bank</MenuItem>
                  <MenuItem value="PNB">Punjab National Bank</MenuItem>
                  <MenuItem value="BOB">Bank of Baroda</MenuItem>
                  <MenuItem value="CANARA">Canara Bank</MenuItem>
                </TextField>

                <PayButton
                  type="submit"
                  variant="contained"
                  disabled={paymentLoading}
                  startIcon={paymentLoading ? <CircularProgress size={20} color="inherit" /> : <PaymentOutlined />}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </PayButton>
              </PaymentForm>
            </PaymentCard>

            {/* Network Failure Simulation */}
            {simulationEnabled && (
              <SimulationSection>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <BugReportOutlined sx={{ mr: 1 }} />
                  Failure Simulation (Testing)
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Simulate network failures and system errors for testing purposes.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="warning"
                    onClick={() => simulateNetworkFailure('timeout')}
                    disabled={paymentLoading}
                    size="small"
                  >
                    Simulate Timeout
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => simulateNetworkFailure('system-error')}
                    disabled={paymentLoading}
                    size="small"
                  >
                    Simulate System Error
                  </Button>
                </Box>
              </SimulationSection>
            )}
          </Box>

          {/* Transaction History Section */}
          <Box sx={{ minWidth: 0 }}>
            <TransactionCard sx={{ height: '520px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <HistoryOutlined sx={{ mr: 1 }} />
                Transaction History
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : transactions.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
                  <Typography>No transactions found</Typography>
                  <Typography variant="body2">Make your first payment to see it here</Typography>
                </Box>
              ) : (
                <List sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none' }}>
                  {transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <TransactionItem>
                        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                          {getStatusIcon(transaction.status)}
                          <Box sx={{ ml: 2, flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {transaction.id}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {transaction.channel} • {transaction.gateway}
                              {transaction.bank && ` • ${transaction.bank}`}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(transaction.timestamp).toLocaleString('en-IN', {
                                timeZone: 'Asia/Kolkata',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true
                              })}
                            </Typography>
                            {transaction.errorMessage && (
                              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                                {transaction.errorMessage}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <AmountDisplay>
                            ₹{transaction.amount.toLocaleString()}
                          </AmountDisplay>
                          <StatusIndicator status={transaction.status}>
                            {transaction.status}
                          </StatusIndicator>
                        </Box>
                      </TransactionItem>
                      {index < transactions.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}

            </TransactionCard>
          </Box>

          {/* Payment Summary Section */}
          <Box sx={{ minWidth: 0 }}>
            <TransactionCard sx={{ height: '520px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
                Payment Summary
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1, justifyContent: 'space-evenly' }}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                    {transactions.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Payments
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                    {transactions.filter(t => t.status === 'SUCCESS').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Successful
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" color="error.main" sx={{ fontWeight: 600 }}>
                    {transactions.filter(t => t.status === 'FAILED').length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Failed
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 600, fontSize: '2rem' }}>
                    ₹{transactions
                      .filter(t => t.status === 'SUCCESS')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                </Box>
              </Box>
            </TransactionCard>
          </Box>
        </Box>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </UserDashboardContainer>
  )
}

export default UserDashboard