export interface PaymentTransaction {
  id: string
  amount: number
  currency: string
  status: 'SUCCESS' | 'FAILED'
  channel: 'WEB' | 'MOBILE' | 'UPI' | 'CARDS'
  gateway: string
  bank?: string
  errorCode?: string
  errorMessage?: string
  timestamp: string
  userId?: string
  razorpayOrderId?: string
  razorpayKeyId?: string
}

export interface FailureAnalytics {
  totalTransactions: number
  failedTransactions: number
  failureRate: number
  failuresByChannel: Record<string, number>
  failuresByGateway: Record<string, number>
  failuresByBank: Record<string, number>
  failuresByErrorSource: Record<string, number>
  failuresTrend: Array<{
    date: string
    count: number
  }>
}

export interface PaymentRequest {
  amount: number
  currency: string
  channel: 'WEB' | 'MOBILE' | 'UPI' | 'CARDS'
  gateway: string
  bank?: string
}

export interface NetworkFailureSimulation {
  enabled: boolean
  timeoutMs: number
  failureRate: number
}