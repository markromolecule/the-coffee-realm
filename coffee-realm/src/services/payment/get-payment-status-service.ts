import { xenditService, type XenditPaymentResponse } from '@/lib/xendit'

export type GetPaymentStatusServiceArgs = {
  invoiceId: string
}

export type GetPaymentStatusServiceDependencies = {
  xenditService: typeof xenditService
}

export async function getPaymentStatusService({
  invoiceId,
  dependencies = { xenditService },
}: GetPaymentStatusServiceArgs & {
  dependencies?: GetPaymentStatusServiceDependencies
}): Promise<XenditPaymentResponse> {
  try {
    const response = await dependencies.xenditService.getInvoice(invoiceId)
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get payment status')
    }

    return response
  } catch (error: any) {
    console.error('Payment status service error:', error)
    return {
      success: false,
      error: error.message || 'Failed to get payment status',
    }
  }
}
