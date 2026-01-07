import React, { useState, useEffect } from 'react'
import {
  Toolbar,
  Typography,
  Button,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { LogoutOutlined } from '@mui/icons-material'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'
import { paymentService } from '../services/paymentService'
import type { PaymentTransaction, FailureAnalytics } from '../types/payment'
import { SimpleChart } from '../components/SimpleChart'
import { Navigation } from '../components/Navigation'
import {
  DashboardContainer,
  MainContent,
  StyledAppBar,
  StyledDrawer,
  MetricCard,
  ChartCard,
  TableCard,
  FilterContainer,
  StatusChip,
  SimulationDecoration,
  StyledToolbar,
  LogoutButton
} from '../styles/staffDashboardStyles'

const StaffDashboard: React.FC = () => {
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('overview')
  const [analytics, setAnalytics] = useState<FailureAnalytics | null>(null)
  const [failedTransactions, setFailedTransactions] = useState<PaymentTransaction[]>([])
  const [allTransactions, setAllTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [simulationDialog, setSimulationDialog] = useState<{
    open: boolean
    type: 'timeout' | 'system-error' | 'bank-server-down' | 'insufficient-balance' | 'kyc-incomplete' | null
  }>({ open: false, type: null })
  const [simulationData, setSimulationData] = useState({
    amount: 100,
    channel: 'WEB',
    bank: '',
    errorType: 'timeout'
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [filters, setFilters] = useState({
    channel: '',
    gateway: '',
    timeRange: '7d'
  })
  const [rootCauses, setRootCauses] = useState<Array<{
    errorCode: string
    errorSource: string
    rootCauseCategory: string
    severity: string
    description: string
  }>>([])


  useEffect(() => {
    loadData()
  }, [activeSection, page, rowsPerPage, ...(activeSection === 'failures' ? [] : [filters])])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeSection === 'overview' || activeSection === 'analytics') {
        const analyticsData = await paymentService.getFailureAnalytics(filters.timeRange)
        setAnalytics(analyticsData)

        // Load root causes for analytics tab
        if (activeSection === 'analytics') {
          const rootCausesData = await paymentService.getRootCauses()
          setRootCauses(rootCausesData)
        }
      }

      if (activeSection === 'failures') {
        const response = await paymentService.getFailedTransactions(1, 1000) // Get all failed transactions
        setFailedTransactions(response.transactions)
        setTotalCount(response.total)
      }

      if (activeSection === 'transactions') {
        const response = await paymentService.getAllTransactions(page + 1, rowsPerPage)
        setAllTransactions(response.transactions)
        setTotalCount(response.total)
      }

      if (activeSection === 'simulation') {
        // No network config loading needed
      }
    } catch (err) {
      setError('Failed to load data. Please try again.')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    setPage(0)
    // Don't reload data for failed transactions - use frontend filtering
    if (activeSection !== 'failures') {
      // Only reload for other sections
    }
  }

  const simulateFailure = async () => {
    setSimulationDialog({ open: true, type: null })
  }

  const handleSimulationConfirm = async () => {
    const { errorType } = simulationData
    if (!errorType) return

    setLoading(true)
    setError(null)
    setSuccess(null)
    setSimulationDialog({ open: false, type: null })

    try {
      await paymentService.simulateFailure(errorType, simulationData.amount, simulationData.channel, simulationData.bank)

      const errorMessages = {
        'timeout': 'Network timeout',
        'system-error': 'System error',
        'bank-server-down': 'Bank server down',
        'insufficient-balance': 'Insufficient balance',
        'kyc-incomplete': 'KYC incomplete',
        'bank-declined': 'Bank declined',
        'limit-exceeded': 'Limit exceeded',
        'account-blocked': 'Account blocked',
        'blacklisted-user': 'Blacklisted user',
        'ip-blocked': 'IP blocked'
      }

      setSuccess(`${errorMessages[errorType as keyof typeof errorMessages]} simulated successfully!`)
      await loadData()
    } catch (err: any) {
      console.log('Simulation error:', err)
      if (err.response?.status === 200 || err.response?.data) {
        setSuccess(`${errorType.replace('-', ' ')} simulated successfully!`)
        await loadData()
      } else {
        setError(`Failed to simulate ${errorType} failure: ${err.message || 'Unknown error'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const renderOverview = () => {
    if (!analytics) return <CircularProgress />

    return (
      <Grid container spacing={3}>
        {/* Metrics Row */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
              {analytics.totalTransactions.toLocaleString()}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
              Total Transactions
            </Typography>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <Typography variant="h4" color="error" sx={{ fontWeight: 600 }}>
              {analytics.failedTransactions.toLocaleString()}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
              Failed Transactions
            </Typography>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <Typography variant="h4" color="warning.main" sx={{ fontWeight: 600 }}>
              {(analytics.failureRate * 100).toFixed(2)}%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
              Failure Rate
            </Typography>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard>
            <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
              {((1 - analytics.failureRate) * 100).toFixed(2)}%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
              Success Rate
            </Typography>
          </MetricCard>
        </Grid>

        {/* Charts Section */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard>
            <SimpleChart
              title="Failures by Channel"
              type="bar"
              data={{
                labels: Object.keys(analytics.failuresByChannel).map(key =>
                  key === 'WEB' ? 'Net Banking' : key === 'MOBILE' ? 'Wallets' : key
                ),
                data: Object.values(analytics.failuresByChannel)
              }}
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard>
            <SimpleChart
              title="Failures by Error Source"
              type="pie"
              data={{
                labels: Object.keys(analytics.failuresByErrorSource),
                data: Object.values(analytics.failuresByErrorSource)
              }}
            />
          </ChartCard>
        </Grid>

        <Grid size={12}>
          <ChartCard>
            <SimpleChart
              title="Failure Trend (Last 7 Days)"
              type="line"
              data={{
                labels: analytics.failuresTrend.map(item =>
                  new Date(item.date).toLocaleDateString()
                ),
                data: analytics.failuresTrend.map(item => item.count)
              }}
            />
          </ChartCard>
        </Grid>
      </Grid>
    )
  }

  const renderAnalytics = () => {
    if (!analytics) return <CircularProgress />

    return (
      <Grid container spacing={3}>
        <Grid size={12}>
          <FilterContainer>
            <TextField
              select
              label="Time Range"
              value={filters.timeRange}
              onChange={(e) => handleFilterChange('timeRange', e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </TextField>
          </FilterContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard sx={{ height: '100%' }}>
            <SimpleChart
              title="Failures by Gateway"
              type="bar"
              data={{
                labels: Object.keys(analytics.failuresByGateway),
                data: Object.values(analytics.failuresByGateway)
              }}
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard sx={{ height: '100%' }}>
            <SimpleChart
              title="Failures by Bank"
              type="bar"
              data={{
                labels: Object.keys(analytics.failuresByBank),
                data: Object.values(analytics.failuresByBank)
              }}
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ChartCard sx={{ height: '100%' }}>
            <SimpleChart
              title="Channel Distribution"
              type="pie"
              data={{
                labels: Object.keys(analytics.failuresByChannel).map(key =>
                  key === 'WEB' ? 'Net Banking' : key === 'MOBILE' ? 'Wallets' : key
                ),
                data: Object.values(analytics.failuresByChannel)
              }}
            />
          </ChartCard>
        </Grid>

        {/* Root Cause Categories Section */}
        <Grid size={12}>
          <ChartCard>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Possible Root Cause Categories
            </Typography>

            {rootCauses.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                No root cause categories found
              </Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
                {rootCauses.map((rootCause, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {rootCause.rootCauseCategory}
                      </Typography>
                      <Chip
                        label={rootCause.severity}
                        size="small"
                        color={
                          rootCause.severity === 'HIGH' ? 'error' :
                            rootCause.severity === 'MEDIUM' ? 'warning' : 'success'
                        }
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                      Error Code: {rootCause.errorCode}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                      Source: {rootCause.errorSource}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {rootCause.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </ChartCard>
        </Grid>
      </Grid>
    )
  }

  const renderFailedTransactions = () => {
    // Apply frontend filtering
    const filteredTransactions = failedTransactions.filter(transaction => {
      const channelMatch = !filters.channel || transaction.channel === filters.channel
      const gatewayMatch = !filters.gateway || transaction.gateway?.toLowerCase() === filters.gateway.toLowerCase()
      return channelMatch && gatewayMatch
    })

    // Apply frontend pagination
    const startIndex = page * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

    return (
      <Grid container spacing={3}>
        <Grid size={12}>
          <TableCard>
            <FilterContainer>
              <TextField
                select
                label="Channel"
                value={filters.channel}
                onChange={(e) => handleFilterChange('channel', e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">All Channels</MenuItem>
                <MenuItem value="WEB">Net Banking</MenuItem>
                <MenuItem value="MOBILE">Wallets</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="CARDS">Cards</MenuItem>
              </TextField>
              <TextField
                select
                label="Gateway"
                value={filters.gateway}
                onChange={(e) => handleFilterChange('gateway', e.target.value)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">All Gateways</MenuItem>
                <MenuItem value="razorpay">Razorpay</MenuItem>
              </TextField>
            </FilterContainer>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Channel</TableCell>
                    <TableCell>Gateway</TableCell>
                    <TableCell>Bank</TableCell>
                    <TableCell>Error Code</TableCell>
                    <TableCell>Error Message</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>₹{transaction.amount}</TableCell>
                      <TableCell>
                        <Chip label={transaction.channel} size="small" />
                      </TableCell>
                      <TableCell>{transaction.gateway}</TableCell>
                      <TableCell>{transaction.bank || 'N/A'}</TableCell>
                      <TableCell>{transaction.errorCode || 'N/A'}</TableCell>
                      <TableCell sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {transaction.errorMessage || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.timestamp).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredTransactions.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10))
                setPage(0)
              }}
            />
          </TableCard>
        </Grid>
      </Grid>
    )
  }

  const renderAllTransactions = () => (
    <Grid container spacing={3} sx={{ width: '100%', m: 0 }}>
      <Grid size={12}>
        <TableCard>
          <Typography variant="h6" sx={{ mb: 2 }}>All Transactions</Typography>
          <TableContainer>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '25%' }}>Transaction ID</TableCell>
                  <TableCell sx={{ width: '10%' }}>Amount</TableCell>
                  <TableCell sx={{ width: '12%' }}>Status</TableCell>
                  <TableCell sx={{ width: '10%' }}>Channel</TableCell>
                  <TableCell sx={{ width: '13%' }}>Gateway</TableCell>
                  <TableCell sx={{ width: '15%' }}>Bank</TableCell>
                  <TableCell sx={{ width: '15%' }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell sx={{ wordBreak: 'break-all' }}>{transaction.id}</TableCell>
                    <TableCell>₹{transaction.amount}</TableCell>
                    <TableCell>
                      <StatusChip status={transaction.status}>
                        {transaction.status}
                      </StatusChip>
                    </TableCell>
                    <TableCell>
                      <Chip label={transaction.channel} size="small" />
                    </TableCell>
                    <TableCell>{transaction.gateway}</TableCell>
                    <TableCell>{transaction.bank || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(transaction.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </TableCard>
      </Grid>
    </Grid>
  )

  const renderSimulation = () => (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 3,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <ChartCard sx={{ height: '100%', m: 0 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>Manual Failure Simulation</Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={simulateFailure}
            disabled={loading}
            fullWidth
            sx={{ height: 50, fontSize: '1.1rem' }}
          >
            Simulate Payment Failure
          </Button>
        </Box>

        <Typography variant="body1" color="textSecondary" sx={{ mt: 3, lineHeight: 1.6 }}>
          Simulate more payment failures with various reasons for analysis purpose
        </Typography>
        <Box component="ul" sx={{ color: 'text.secondary', mt: 1 }}>
          <li>Test notification and logging systems</li>
          <li>Ensure users receive helpful feedback during failures</li>
          <li>Validate bank-specific failure edge cases</li>
        </Box>
      </ChartCard>

      <SimulationDecoration sx={{ height: '100%', m: 0 }}>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
            Simulation Environment
          </Typography>
          <Box sx={{
            mt: 4,
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            border: '2px dashed #1976d2'
          }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#1976d2',
              boxShadow: '0 0 20px rgba(25, 118, 210, 0.3)'
            }} />
          </Box>
        </Box>
      </SimulationDecoration>
    </Box>
  )

  const renderContent = () => {
    if (loading && !analytics && !failedTransactions.length && !allTransactions.length) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      )
    }

    switch (activeSection) {
      case 'overview':
        return renderOverview()
      case 'analytics':
        return renderAnalytics()
      case 'failures':
        return renderFailedTransactions()
      case 'transactions':
        return renderAllTransactions()
      case 'simulation':
        return renderSimulation()
      default:
        return renderOverview()
    }
  }

  return (
    <DashboardContainer>
      <StyledAppBar position="fixed">
        <StyledToolbar>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            Payment Failure Dashboard - Staff
          </Typography>
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

      <StyledDrawer variant="permanent">
        <Toolbar />
        <Navigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </StyledDrawer>

      <MainContent>
        {renderContent()}
      </MainContent>

      {/* Simulation Dialog */}
      <Dialog open={simulationDialog.open} onClose={() => setSimulationDialog({ open: false, type: null })}>
        <DialogTitle>
          Simulate Payment Failure
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 300 }}>
            <TextField
              select
              label="Error Type"
              value={simulationData.errorType}
              onChange={(e) => setSimulationData(prev => ({ ...prev, errorType: e.target.value }))}
              fullWidth
            >
              <MenuItem value="timeout">Network Timeout</MenuItem>
              <MenuItem value="system-error">System Error</MenuItem>
              <MenuItem value="bank-server-down">Bank Server Down</MenuItem>
              <MenuItem value="insufficient-balance">Insufficient Balance</MenuItem>
              <MenuItem value="kyc-incomplete">KYC Incomplete</MenuItem>
              <MenuItem value="bank-declined">Bank Declined</MenuItem>
              <MenuItem value="limit-exceeded">Limit Exceeded</MenuItem>
              <MenuItem value="account-blocked">Account Blocked</MenuItem>
              <MenuItem value="blacklisted-user">Blacklisted User</MenuItem>
              <MenuItem value="ip-blocked">IP Blocked</MenuItem>
            </TextField>
            <TextField
              label="Amount"
              type="number"
              value={simulationData.amount}
              onChange={(e) => setSimulationData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
              }}
              fullWidth
            />
            <TextField
              select
              label="Payment Channel"
              value={simulationData.channel}
              onChange={(e) => setSimulationData(prev => ({ ...prev, channel: e.target.value }))}
              fullWidth
            >
              <MenuItem value="WEB">Net Banking</MenuItem>
              <MenuItem value="MOBILE">Wallets</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="CARDS">Cards</MenuItem>
            </TextField>
            <TextField
              select
              label="Bank (Optional)"
              value={simulationData.bank}
              onChange={(e) => setSimulationData(prev => ({ ...prev, bank: e.target.value }))}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSimulationDialog({ open: false, type: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleSimulationConfirm}
            variant="contained"
            color="error"
          >
            Simulate Failure
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
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
    </DashboardContainer>
  )
}

export default StaffDashboard