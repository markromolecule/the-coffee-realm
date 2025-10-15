import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart as ShoppingCartIcon } from 'lucide-react'
import { CartItemComponent } from './CartItem'
import { CartSummary } from './CartSummary'
import type { CartItem } from '@/stores/use-cart-store'

interface ShoppingCartProps {
  items: CartItem[]
  total: number
  tax: number
  grandTotal: number
  itemCount: number
  paymentMethod: 'cash' | 'card'
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onPaymentMethodChange: (method: 'cash' | 'card') => void
  onCheckout: () => void
  onClearCart: () => void
}

export const ShoppingCartComponent: React.FC<ShoppingCartProps> = ({
  items,
  total,
  tax,
  grandTotal,
  itemCount,
  paymentMethod,
  onUpdateQuantity,
  onRemoveItem,
  onPaymentMethodChange,
  onCheckout,
  onClearCart,
}) => {
  return (
    <div className="w-96 flex flex-col bg-white border-l border-gray-200 h-full">
      <Card className="flex-1 border-0 rounded-none flex flex-col h-full">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCartIcon className="h-5 w-5" />
            Current Order
            {itemCount > 0 && (
              <Badge variant="default" className="bg-orange-600">
                {itemCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Cart Items - Fixed height with scroll */}
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 mb-4 pr-2">
            {items.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <ShoppingCartIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items in cart</p>
                <p className="text-sm">Select items from the menu</p>
              </div>
            ) : (
              items.map((item) => (
                <CartItemComponent
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))
            )}
          </div>

          {/* Cart Summary - Fixed at bottom */}
          {items.length > 0 && (
            <CartSummary
              total={total}
              tax={tax}
              grandTotal={grandTotal}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={onPaymentMethodChange}
              onCheckout={onCheckout}
              onClearCart={onClearCart}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
