import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CreditCard, Loader2 } from 'lucide-react'
import { OrderSummary } from '@/components/payment/OrderSummary'
import { CustomerForm } from '@/components/payment/CustomerForm'
import { PaymentStatus } from '@/components/payment/PaymentStatus'
import { type XenditInvoice } from '@/lib/xendit'
import { createPaymentService } from '@/services/payment/create-payment-service'
import { getPaymentStatusService } from '@/services/payment/get-payment-status-service'
import type { CartItem } from '@/stores/use-cart-store'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  total: number
  tax: number
  grandTotal: number
  onSuccess: (invoiceId: string) => void
}


export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  total,
  tax,
  grandTotal,
  onSuccess,
}) => {
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [invoice, setInvoice] = useState<XenditInvoice | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'ready' | 'success' | 'failed'>('idle')

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInvoice(null)
      setError(null)
      setPaymentStatus('idle')
              setCustomerName('')
              setCustomerEmail('')
              setCustomerPhone('')
    }
  }, [isOpen])

  // Poll for payment status
  useEffect(() => {
    if (!invoice || paymentStatus !== 'processing') return

    const pollInterval = setInterval(async () => {
      try {
        const response = await getPaymentStatusService({
          invoiceId: invoice.id,
        })
        if (response.success && response.data) {
          const status = response.data.status
          if (status === 'PAID' || status === 'SETTLED') {
            setPaymentStatus('success')
            clearInterval(pollInterval)
            setTimeout(() => {
              onSuccess(invoice.id)
              onClose()
            }, 2000)
          } else if (status === 'EXPIRED') {
            setPaymentStatus('failed')
            setError('Payment expired')
            clearInterval(pollInterval)
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [invoice, paymentStatus, onSuccess, onClose])

  const handleCreatePayment = async () => {
    // Validate required fields
    if (!customerName.trim()) {
      setError('Customer name is required')
      return
    }

    setLoading(true)
    setError(null)
    setPaymentStatus('processing')

    try {
      const response = await createPaymentService({
        items,
        customerName,
        customerEmail,
        customerPhone,
        grandTotal,
      })

      if (response.success && response.data) {
        setInvoice(response.data)
        setPaymentStatus('processing')
        console.log('Xendit invoice created:', response.data.id)
        console.log('Invoice URL:', response.data.invoice_url)
        
        // Wait 2 seconds before showing proceed button
        setTimeout(() => {
          console.log('Setting payment status to ready')
          setPaymentStatus('ready')
        }, 2000)
      } else {
        console.error('Payment creation failed:', response.error)
        setError(response.error || 'Failed to create payment')
      }
    } catch (error: any) {
      setError(error.message || 'Payment creation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyInvoiceUrl = () => {
    if (invoice?.invoice_url) {
      navigator.clipboard.writeText(invoice.invoice_url)
    }
  }

  const openInvoiceUrl = () => {
    if (invoice?.invoice_url) {
      // Store order data in localStorage before redirecting
      const orderData = {
        items: items,
        customerName: customerName || undefined,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined,
        total: total,
        tax: tax,
        grandTotal: grandTotal,
        timestamp: new Date().toISOString()
      }
      
      localStorage.setItem('pendingXenditOrder', JSON.stringify(orderData))
      console.log('Stored order data before Xendit redirect:', orderData)
      
      // Open Xendit checkout page in the same window
      window.location.href = invoice.invoice_url
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader className="px-4 sm:px-6">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
            Payment Processing
          </DialogTitle>
          <DialogDescription className="text-sm">
            Complete your order payment with Xendit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Order Summary */}
          <OrderSummary
            items={items}
            total={total}
            tax={tax}
            grandTotal={grandTotal}
          />

          {/* Payment Status - Only show when not idle */}
          {paymentStatus !== 'idle' && (
            <PaymentStatus
              status={paymentStatus}
              invoice={invoice}
              error={error}
              onProceedToCheckout={openInvoiceUrl}
              onCopyInvoiceUrl={copyInvoiceUrl}
              onTryAgain={() => {
                setError(null)
                setPaymentStatus('idle')
                setInvoice(null)
              }}
              onClose={onClose}
            />
          )}


          {/* Payment Form */}
          {paymentStatus === 'idle' && (
            <>
              {/* Customer Information */}
              <CustomerForm
                customerName={customerName}
                customerEmail={customerEmail}
                customerPhone={customerPhone}
                onNameChange={setCustomerName}
                onEmailChange={setCustomerEmail}
                onPhoneChange={setCustomerPhone}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreatePayment}
                  disabled={loading || !customerName.trim()}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 order-1 sm:order-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Payment...
                    </>
                  ) : (
                    'Create Payment'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
