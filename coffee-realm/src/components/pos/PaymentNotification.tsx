import React from 'react'
import { cn } from '@/lib/utils'

interface PaymentNotificationProps {
  result: 'success' | 'failed' | null
  onDismiss: () => void
}

export const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  result,
  onDismiss,
}) => {
  if (!result) return null

  return (
    <div className={cn(
      'mb-4 p-4 rounded-lg border flex items-center justify-between',
      result === 'success' 
        ? 'bg-green-50 border-green-200 text-green-800'
        : 'bg-red-50 border-red-200 text-red-800'
    )}>
      <div className="flex items-center space-x-3">
        {result === 'success' ? (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-medium">Payment Successful!</span>
            <span className="text-sm">Your order has been processed.</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="font-medium">Payment Failed</span>
            <span className="text-sm">Please try again or use a different payment method.</span>
          </>
        )}
      </div>
      <button 
        onClick={onDismiss}
        className="text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  )
}
