import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'
import { xenditService } from '@/lib/xendit'
import type { InventoryItem } from '@/stores/use-inventory-store'

interface ProductGridProps {
  items: InventoryItem[]
  onAddToCart: (item: InventoryItem) => void
}

export const ProductGrid: React.FC<ProductGridProps> = ({ items, onAddToCart }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className={cn(
              'cursor-pointer transition-colors duration-200',
              'hover:border-orange-300 hover:bg-orange-50/30',
              'border border-gray-200'
            )}
            onClick={() => onAddToCart(item)}
          >
            <CardContent className="p-4">
              {/* Item Image */}
              <div className="w-full h-24 bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-md"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg></div>'
                      }
                    }}
                  />
                ) : (
                  <Coffee className="h-12 w-12 text-gray-400" />
                )}
              </div>
              {/* Item Info */}
              <div>
                <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description || 'Delicious item from our menu'}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">
                    ₱ {xenditService.formatAmount(item.price).toLocaleString()}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    Stock: {item.stock}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
