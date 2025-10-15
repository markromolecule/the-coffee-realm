import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { xenditService } from '@/lib/xendit'
import type { CartItem } from '@/stores/use-cart-store'

interface CartItemProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3',
        'border border-gray-200 rounded-lg',
        'bg-white hover:bg-gray-50 transition-colors'
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm truncate">{item.name}</h4>
          <span className="text-sm font-semibold text-orange-600">
            ₱ {xenditService.formatAmount(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
        <p className="text-xs text-gray-500">
          ₱ {xenditService.formatAmount(item.price).toLocaleString()} each
        </p>
      </div>

      <div className="flex items-center gap-1 ml-3">
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0 hover:bg-red-50 hover:border-red-200"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="font-medium w-6 text-center text-sm">
          {item.quantity}
        </span>
        
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0 hover:bg-green-50 hover:border-green-200"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0 ml-1 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
