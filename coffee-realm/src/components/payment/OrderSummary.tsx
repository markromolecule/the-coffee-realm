import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { xenditService } from '@/lib/xendit'
import type { CartItem } from '@/stores/use-cart-store'

interface OrderSummaryProps {
  items: CartItem[]
  total: number
  tax: number
  grandTotal: number
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  total,
  tax,
  grandTotal,
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-32 overflow-y-auto space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>₱ {xenditService.formatAmount(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₱ {xenditService.formatAmount(total).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%):</span>
            <span>₱ {xenditService.formatAmount(tax).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Total:</span>
            <span className="text-orange-600">₱ {xenditService.formatAmount(grandTotal).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
