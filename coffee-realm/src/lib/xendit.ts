import axios from 'axios'

// Xendit configuration
const XENDIT_PUBLIC_KEY = import.meta.env.VITE_XENDIT_PUBLIC_KEY
const XENDIT_SECRET_KEY = import.meta.env.XENDIT_SECRET_KEY || 'xnd_development_JpplJUdu6kVqL8qrLfq1pGlcQ2jdYP8ODwLcoA9C2Bds9LDBwmXEyHsjlD6Wt8'
const XENDIT_CUSTOMER_ID = import.meta.env.VITE_XENDIT_CUSTOMER_ID
const XENDIT_REFERENCE_ID = import.meta.env.VITE_XENDIT_REFERENCE_ID

// Xendit API base URL
const XENDIT_BASE_URL = 'https://api.xendit.co'

// Create axios instance with Xendit configuration
const xenditApi = axios.create({
  baseURL: XENDIT_BASE_URL,
  headers: {
    'Authorization': `Basic ${btoa(XENDIT_SECRET_KEY + ':')}`,
    'Content-Type': 'application/json',
    'X-XENDIT-CLIENT-USER-ID': '', // Add this if needed by Xendit
  },
})

export type PaymentMethod = 'CREDIT_CARD' | 'GCASH' | 'GRABPAY' | 'PAYMAYA'

export interface CreateInvoiceRequest {
  external_id: string
  amount: number
  payer_email?: string
  customer_name?: string
  customer_phone?: string
  description: string
  invoice_duration?: number
  success_redirect_url?: string
  failure_redirect_url?: string
  payment_methods?: PaymentMethod[]
}

export interface XenditInvoice {
  id: string
  external_id: string
  user_id: string
  status: 'PENDING' | 'PAID' | 'SETTLED' | 'EXPIRED'
  merchant_name: string
  amount: number
  payer_email?: string
  description: string
  invoice_url: string
  expiry_date: string
  created: string
  updated: string
  currency: string
  payment_method?: string
  payment_channel?: string
  payment_destination?: string
}

export interface XenditPaymentResponse {
  success: boolean
  data?: XenditInvoice
  error?: string
}

class XenditService {
  /**
   * Create a payment invoice
   */
  async createInvoice(request: CreateInvoiceRequest): Promise<XenditPaymentResponse> {
    try {
      // Simplified payload for Xendit staging - using basic format
      const payload: any = {
        external_id: request.external_id,
        amount: request.amount,
        description: request.description,
        invoice_duration: request.invoice_duration || 86400,
        currency: 'PHP',
      }

      // Add customer information if provided (simplified format)
      if (request.customer_name) {
        payload.customer_name = request.customer_name
      }
      if (request.payer_email) {
        payload.payer_email = request.payer_email
      }
      if (request.customer_phone) {
        payload.customer_phone = request.customer_phone
      }

      // Add success/failure URLs if provided
      if (request.success_redirect_url) {
        payload.success_redirect_url = request.success_redirect_url
      }
      if (request.failure_redirect_url) {
        payload.failure_redirect_url = request.failure_redirect_url
      }

      // Add payment methods if specified (simplified format)
      if (request.payment_methods && request.payment_methods.length > 0) {
        payload.payment_methods = request.payment_methods
      }

      console.log('Creating Xendit invoice with payload:', payload)
      console.log('Using API endpoint: /v2/invoices')

      const response = await xenditApi.post('/v2/invoices', payload)

      console.log('Xendit response:', response.data)

      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      console.error('Xendit API Error Details:')
      console.error('Status:', error.response?.status)
      console.error('Data:', error.response?.data)
      console.error('Headers:', error.response?.headers)
      
      // Try to provide helpful error messages
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'API key does not have permission to create invoices. Please check your Xendit dashboard settings.',
        }
      }
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Invalid API key. Please verify your Xendit credentials.',
        }
      }
      
      if (error.response?.status === 400) {
        const errorMsg = error.response?.data?.message || 'Invalid request parameters'
        
        // Check for payment method mismatch error
        if (errorMsg.includes('payment method choices did not match')) {
          return {
            success: false,
            error: 'Selected payment method is not available in your Xendit account. Please enable GCash, GrabPay, or PayMaya in your Xendit dashboard under Payment Channels.',
          }
        }
        
        return {
          success: false,
          error: `Bad request: ${errorMsg}`,
        }
      }

      return {
        success: false,
        error: this.getReadableError(error),
      }
    }
  }

  /**
   * Get readable error message
   */
  private getReadableError(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.response?.status === 403) {
      return 'API permissions insufficient. Please check Xendit dashboard settings.'
    }
    if (error.response?.status === 401) {
      return 'Invalid API key. Please check your Xendit credentials.'
    }
    return error.message || 'Payment service unavailable. Please try again.'
  }

  /**
   * Get invoice status
   */
  async getInvoice(invoiceId: string): Promise<XenditPaymentResponse> {
    try {
      // Handle demo invoices
      if (invoiceId.startsWith('demo_invoice_')) {
        const mockInvoice: XenditInvoice = {
          id: invoiceId,
          external_id: 'demo_external_id',
          user_id: 'demo_user',
          status: 'PAID', // Simulate successful payment for demo
          merchant_name: 'Coffee Realm POS',
          amount: 100,
          description: 'Demo payment',
          invoice_url: `https://checkout-staging.xendit.co/web/demo`,
          expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
          currency: 'PHP',
        }

        return {
          success: true,
          data: mockInvoice,
        }
      }

      const response = await xenditApi.get(`/v2/invoices/${invoiceId}`)

      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      console.error('Get invoice error:', error.response?.data || error.message)
      return {
        success: false,
        error: this.getReadableError(error),
      }
    }
  }

  /**
   * Create a simple charge for testing (Credit Card)
   */
  async createCharge(amount: number, description: string): Promise<XenditPaymentResponse> {
    try {
      const response = await xenditApi.post('/charges', {
        token_id: 'sample_token_id', // This would come from Xendit.js on frontend
        external_id: `charge_${Date.now()}`,
        amount: amount,
        authentication_id: 'sample_authentication_id',
        description: description,
        currency: 'PHP',
      })

      return {
        success: true,
        data: response.data,
      }
    } catch (error: any) {
      console.error('Xendit charge error:', error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Charge failed',
      }
    }
  }

  /**
   * Generate external ID for orders
   */
  generateExternalId(orderId: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `coffeerealmpos_${orderId}_${timestamp}_${random}`
  }

  /**
   * Format amount to PHP (Xendit expects decimal amounts for PHP)
   */
  formatAmount(usdAmount: number): number {
    // Convert USD to PHP (approximate rate: 1 USD = 56 PHP)
    const phpAmount = usdAmount * 56
    return Math.round(phpAmount * 100) / 100 // Round to 2 decimal places
  }
}

export const xenditService = new XenditService()

// Export configuration for frontend use
export const xenditConfig = {
  publicKey: XENDIT_PUBLIC_KEY,
  customerId: XENDIT_CUSTOMER_ID,
  referenceId: XENDIT_REFERENCE_ID,
}

