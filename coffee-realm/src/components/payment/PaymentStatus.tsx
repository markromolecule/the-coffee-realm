import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
} from 'lucide-react'
import type { XenditInvoice } from '@/lib/xendit'

interface PaymentStatusProps {
  status: 'idle' | 'processing' | 'ready' | 'success' | 'failed'
  invoice: XenditInvoice | null
  error: string | null
  onProceedToCheckout: () => void
  onCopyInvoiceUrl: () => void
  onTryAgain: () => void
  onClose: () => void
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  status,
  invoice,
  error,
  onProceedToCheckout,
  onCopyInvoiceUrl,
  onTryAgain,
  onClose,
}) => {
  if (status === 'processing' && invoice) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="font-medium">Creating Payment...</span>
            </div>
            <p className="text-sm text-gray-600">
              Please wait while we prepare your payment link
            </p>
            <Badge variant="secondary" className="text-xs">
              Invoice ID: {invoice.id}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'ready' && invoice) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium">Payment Ready</span>
            </div>
            <p className="text-sm text-gray-600">
              Click below to proceed to Xendit checkout
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={onProceedToCheckout}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Proceed to Checkout
              </Button>
              <Button 
                variant="outline"
                onClick={onCopyInvoiceUrl}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">
              Invoice ID: {invoice.id}
            </Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'success') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800">Payment Successful!</h3>
            <p className="text-sm text-gray-700">Your order has been placed.</p>
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === 'failed' && error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-600 mx-auto" />
            <h3 className="text-xl font-semibold text-red-800">Payment Failed</h3>
            <p className="text-sm text-gray-700">{error}</p>
            <Button onClick={onTryAgain} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
