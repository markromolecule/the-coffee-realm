import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// Define types
export type InventoryItem = {
  id: string
  name: string
  category: string
  price: number
  cost: number
  stock: number
  lowStockThreshold: number
  image?: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type InventoryStoreState = {
  items: InventoryItem[]
  categories: string[]
  lowStockItems: InventoryItem[]
}

export type InventoryStoreActions = {
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateItem: (itemId: string, updates: Partial<Omit<InventoryItem, 'id' | 'createdAt'>>) => void
  deleteItem: (itemId: string) => void
  updateStock: (itemId: string, newStock: number) => void
  getItemById: (itemId: string) => InventoryItem | undefined
  getLowStockItems: () => void
  getItemsByCategory: (category: string) => InventoryItem[]
  initializeDefaultItems: () => void
}

// Default state constant
export const DEFAULT_INVENTORY_STORE_STATE: InventoryStoreState = {
  items: [],
  categories: ['Coffee', 'Tea', 'Pastries', 'Sandwiches', 'Beverages'],
  lowStockItems: [],
}

// Combined store type
export type InventoryStore = InventoryStoreState & InventoryStoreActions

// Create and export the store hook
export const useInventoryStore = create(
  immer<InventoryStore>((set, get) => ({
    ...DEFAULT_INVENTORY_STORE_STATE,

    /* Actions */
    addItem: (newItem) => {
      set(state => {
        const now = new Date()
        const item: InventoryItem = {
          ...newItem,
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: now,
          updatedAt: now,
        }
        state.items.push(item)
        
        // Update categories if new category
        if (!state.categories.includes(item.category)) {
          state.categories.push(item.category)
        }
      })
      get().getLowStockItems()
    },

    updateItem: (itemId, updates) => {
      set(state => {
        const itemIndex = state.items.findIndex(item => item.id === itemId)
        if (itemIndex !== -1) {
          state.items[itemIndex] = {
            ...state.items[itemIndex],
            ...updates,
            updatedAt: new Date(),
          }
          
          // Update categories if category changed
          if (updates.category && !state.categories.includes(updates.category)) {
            state.categories.push(updates.category)
          }
        }
      })
      get().getLowStockItems()
    },

    deleteItem: (itemId) => {
      set(state => {
        state.items = state.items.filter(item => item.id !== itemId)
      })
      get().getLowStockItems()
    },

    updateStock: (itemId, newStock) => {
      set(state => {
        const item = state.items.find(item => item.id === itemId)
        if (item) {
          item.stock = newStock
          item.updatedAt = new Date()
        }
      })
      get().getLowStockItems()
    },

    getItemById: (itemId) => {
      return get().items.find(item => item.id === itemId)
    },

    getLowStockItems: () => {
      set(state => {
        state.lowStockItems = state.items.filter(
          item => item.isActive && item.stock <= item.lowStockThreshold
        )
      })
    },

    getItemsByCategory: (category) => {
      return get().items.filter(item => item.category === category && item.isActive)
    },

    initializeDefaultItems: () => {
      set(state => {
        if (state.items.length === 0) {
          const defaultItems: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
            {
              name: 'Americano',
              category: 'Coffee',
              price: 4.50,
              cost: 1.20,
              stock: 50,
              lowStockThreshold: 10,
              description: 'Rich and bold espresso with hot water',
              image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
              isActive: true,
            },
            {
              name: 'Latte',
              category: 'Coffee',
              price: 5.50,
              cost: 1.80,
              stock: 45,
              lowStockThreshold: 10,
              description: 'Smooth espresso with steamed milk',
              image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=300&h=200&fit=crop',
              isActive: true,
            },
            {
              name: 'Cappuccino',
              category: 'Coffee',
              price: 5.00,
              cost: 1.60,
              stock: 40,
              lowStockThreshold: 10,
              description: 'Equal parts espresso, steamed milk, and foam',
              image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=200&fit=crop',
              isActive: true,
            },
            {
              name: 'Espresso',
              category: 'Coffee',
              price: 3.50,
              cost: 1.00,
              stock: 30,
              lowStockThreshold: 15,
              description: 'Pure espresso shot',
              image: 'https://www.sharmispassions.com/wp-content/uploads/2012/07/espresso-coffee-recipe022.jpg',
              isActive: true,
            },
            {
              name: 'Green Tea',
              category: 'Tea',
              price: 3.00,
              cost: 0.80,
              stock: 25,
              lowStockThreshold: 8,
              description: 'Refreshing green tea',
              image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
              isActive: true,
            },
            {
              name: 'Croissant',
              category: 'Pastries',
              price: 3.50,
              cost: 1.20,
              stock: 20,
              lowStockThreshold: 5,
              description: 'Buttery, flaky croissant',
              image: 'https://static01.nyt.com/images/2021/04/07/dining/06croissantsrex1/merlin_184841898_ccc8fb62-ee41-44e8-9ddf-b95b198b88db-threeByTwoMediumAt2X.jpg?quality=75&auto=webp',
              isActive: true,
            },
            {
              name: 'Blueberry Muffin',
              category: 'Pastries',
              price: 4.00,
              cost: 1.50,
              stock: 15,
              lowStockThreshold: 5,
              description: 'Fresh blueberry muffin',
              image: 'https://www.allrecipes.com/thmb/57iiSIoJi4CqyK3PgRTxDJ9GMoo=/0x512/filters:no_upscale():max_bytes(150000):strip_icc()/6865-to-die-for-blueberry-muffins-VAT-013-3x2-39d17680ad4742fd802901dbb031255b.jpg',
              isActive: true,
            },
            {
              name: 'Club Sandwich',
              category: 'Sandwiches',
              price: 8.50,
              cost: 3.20,
              stock: 12,
              lowStockThreshold: 3,
              description: 'Triple-decker club sandwich',
              image: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Club_sandwich_at_Café_Picnic.jpg',
              isActive: true,
            },
          ]

          defaultItems.forEach(item => {
            const now = new Date()
            state.items.push({
              ...item,
              id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              createdAt: now,
              updatedAt: now,
            })
          })
        }
      })
      get().getLowStockItems()
    },
  }))
)
