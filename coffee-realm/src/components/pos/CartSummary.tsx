import React from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CreditCard, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { xenditService } from '@/lib/xendit'

interface CartSummaryProps {
  total: number
  tax: number
  grandTotal: number
  paymentMethod: 'cash' | 'card'
  onPaymentMethodChange: (method: 'cash' | 'card') => void
  onCheckout: () => void
  onClearCart: () => void
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  total,
  tax,
  grandTotal,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout,
  onClearCart,
}) => {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 pt-4">
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>₱ {xenditService.formatAmount(total).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (8%):</span>
          <span>₱ {xenditService.formatAmount(tax).toLocaleString()}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span className="text-orange-600">₱ {xenditService.formatAmount(grandTotal).toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Payment Method</h4>
        <div className="flex gap-2">
          <Button
            variant={paymentMethod === 'cash' ? 'default' : 'outline'}
            onClick={() => onPaymentMethodChange('cash')}
            className={cn(
              'flex-1',
              paymentMethod === 'cash'
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Cash
          </Button>
          <Button
            variant={paymentMethod === 'card' ? 'default' : 'outline'}
            onClick={() => onPaymentMethodChange('card')}
            className={cn(
              'flex-1',
              paymentMethod === 'card'
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Card
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          className={cn(
            'w-full bg-orange-600 hover:bg-orange-700',
            'text-white font-medium py-3'
          )}
          onClick={onCheckout}
        >
          {paymentMethod === 'card' ? (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay with Xendit - ₱ {xenditService.formatAmount(grandTotal).toLocaleString()}
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-4 w-4" />
              Complete Cash Order - ₱ {xenditService.formatAmount(grandTotal).toLocaleString()}
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearCart}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  )
}
