import React from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Coffee, Utensils } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CategoryNavigationProps {
  categories: string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Coffee':
        return <Coffee className="mr-2 h-4 w-4" />
      case 'Tea':
      case 'Pastries':
        return <Utensils className="mr-2 h-4 w-4" />
      case 'All':
        return <ShoppingCart className="mr-2 h-4 w-4" />
      default:
        return <Utensils className="mr-2 h-4 w-4" />
    }
  }

  return (
    <div className="mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4">Menu</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => onCategoryChange(category)}
            size="sm"
            className={cn(
              'flex-shrink-0 text-xs sm:text-sm',
              selectedCategory === category
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            )}
          >
            <span className="hidden sm:inline">{getCategoryIcon(category)}</span>
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
