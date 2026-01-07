import axios from 'axios'
import type { PaymentTransaction, FailureAnalytics, PaymentRequest } from '../types/payment'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5034/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage')
  if (token) {
    const authData = JSON.parse(token)
    if (authData.state?.token) {
      config.headers.Authorization = `Bearer ${authData.state.token}`
    }
  }
  return config
})

export const paymentService = {
  async initiatePayment(paymentData: PaymentRequest): Promise<PaymentTransaction> {
    const response = await api.post('/Payment/initiate', {
      amount: paymentData.amount,
      currency: paymentData.currency,
      channel: paymentData.channel,
      gateway: paymentData.gateway,
      bank: paymentData.bank
    })
    return response.data
  },

  async getUserTransactions(): Promise<PaymentTransaction[]> {
    const response = await api.get('/Payment/user-transactions')
    return response.data
  },

  async getFailureAnalytics(timeRange?: string): Promise<FailureAnalytics> {
    const response = await api.get(`/Analytics/failure-analytics${timeRange ? `?timeRange=${timeRange}` : ''}`)
    return response.data
  },

  async getNetworkFailureConfig(): Promise<{ enabled: boolean; timeoutMs: number; failureRate: number }> {
    try {
      const response = await api.get('/Simulation/config')
      return response.data
    } catch (err) {
      console.warn('Network failure config endpoint not found, using defaults')
      return { enabled: false, timeoutMs: 5000, failureRate: 0.1 }
    }
  },

  async getFailedTransactions(page = 1, limit = 10): Promise<{
    transactions: PaymentTransaction[]
    total: number
    page: number
    totalPages: number
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    const response = await api.get(`/Payment/failed-transactions?${params}`)
    return response.data
  },

  async getAllTransactions(page = 1, limit = 10): Promise<{
    transactions: PaymentTransaction[]
    total: number
    page: number
    totalPages: number
  }> {
    const response = await api.get(`/Payment/all-transactions?page=${page}&limit=${limit}`)
    return response.data
  },

  async simulateTimeout(): Promise<PaymentTransaction> {
    return this.simulateFailure('timeout')
  },

  async simulateSystemError(): Promise<PaymentTransaction> {
    return this.simulateFailure('system-error')
  },

  async simulateFailure(errorType: string, amount?: number, channel?: string, bank?: string): Promise<PaymentTransaction> {
    const endpoints = {
      'timeout': '/Simulation/timeout',
      'system-error': '/Simulation/system-error',
      'bank-server-down': '/Simulation/bank-server-down',
      'insufficient-balance': '/Simulation/insufficient-balance',
      'kyc-incomplete': '/Simulation/kyc-incomplete',
      'bank-declined': '/Simulation/bank-declined',
      'limit-exceeded': '/Simulation/limit-exceeded',
      'account-blocked': '/Simulation/account-blocked',
      'blacklisted-user': '/Simulation/blacklisted-user',
      'ip-blocked': '/Simulation/ip-blocked'
    }

    const endpoint = endpoints[errorType as keyof typeof endpoints] || endpoints['system-error']

    const response = await api.post(endpoint, {
      amount: amount || 100,
      channel: channel || 'WEB',
      bank: bank || ''
    })
    return response.data
  },

  async updatePaymentStatus(transactionId: string, status: 'SUCCESS' | 'FAILED', errorCode?: string, errorReason?: string, errorStep?: string): Promise<any> {
    const response = await api.post('/Payment/update-status', {
      transactionId,
      status,
      errorCode,
      errorReason,
      errorStep
    })
    return response.data
  },

  async getRootCauses(): Promise<Array<{
    errorCode: string
    errorSource: string
    rootCauseCategory: string
    severity: string
    description: string
  }>> {
    const response = await api.get('/FailureRootCause')
    return response.data
  }
}