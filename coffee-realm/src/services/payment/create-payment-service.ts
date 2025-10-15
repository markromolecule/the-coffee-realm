import { xenditService, type CreateInvoiceRequest, type XenditPaymentResponse } from '@/lib/xendit'
import type { CartItem } from '@/stores/use-cart-store'

export type CreatePaymentServiceArgs = {
  items: CartItem[]
  customerName: string
  customerEmail?: string
  customerPhone?: string
  grandTotal: number
}

export type CreatePaymentServiceDependencies = {
  xenditService: typeof xenditService
}

export async function createPaymentService({
  items,
  customerName,
  customerEmail,
  customerPhone,
  grandTotal,
  dependencies = { xenditService },
}: CreatePaymentServiceArgs & {
  dependencies?: CreatePaymentServiceDependencies
}): Promise<XenditPaymentResponse> {
  try {
    const orderDescription = `Coffee Realm POS - ${items.length} item(s)`
    const externalId = dependencies.xenditService.generateExternalId(Date.now().toString())
    const amountInPHP = dependencies.xenditService.formatAmount(grandTotal)

    const request: CreateInvoiceRequest = {
      external_id: externalId,
      amount: amountInPHP,
      payer_email: customerEmail || undefined,
      customer_name: customerName, // Now required
      customer_phone: customerPhone || undefined,
      description: orderDescription,
      invoice_duration: 86400, // 24 hours
      success_redirect_url: `${window.location.origin}/dashboard/pos?payment=success`,
      failure_redirect_url: `${window.location.origin}/dashboard/pos?payment=failed`,
      // Don't specify payment methods - let Xendit use all available methods
      // payment_methods: [paymentMethod as any],
    }

    console.log('Creating Xendit invoice with request:', request)
    const response = await dependencies.xenditService.createInvoice(request)
    console.log('Xendit response:', response)
    
    if (!response.success) {
      console.error('Xendit invoice creation failed:', response.error)
      throw new Error(response.error || 'Failed to create payment')
    }

    console.log('Xendit invoice created successfully:', response.data?.id)
    return response
  } catch (error: any) {
    console.error('Payment service error:', error)
    return {
      success: false,
      error: error.message || 'Payment creation failed',
    }
  }
}
