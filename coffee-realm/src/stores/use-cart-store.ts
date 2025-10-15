import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// Define types
export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  category: string
  image?: string
}

export type CartStoreState = {
  items: CartItem[]
  total: number
  itemCount: number
}

export type CartStoreActions = {
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  calculateTotals: () => void
}

// Default state constant
export const DEFAULT_CART_STORE_STATE: CartStoreState = {
  items: [],
  total: 0,
  itemCount: 0,
}

// Combined store type
export type CartStore = CartStoreState & CartStoreActions

// Create and export the store hook
export const useCartStore = create(
  immer<CartStore>((set, get) => ({
    ...DEFAULT_CART_STORE_STATE,

    /* Actions */
    addItem: (newItem) => {
      set(state => {
        const existingItem = state.items.find(item => item.id === newItem.id)
        
        if (existingItem) {
          existingItem.quantity += 1
        } else {
          state.items.push({
            ...newItem,
            quantity: 1,
          })
        }
      })
      get().calculateTotals()
    },

    removeItem: (itemId) => {
      set(state => {
        state.items = state.items.filter(item => item.id !== itemId)
      })
      get().calculateTotals()
    },

    updateQuantity: (itemId, quantity) => {
      if (quantity <= 0) {
        get().removeItem(itemId)
        return
      }
      
      set(state => {
        const item = state.items.find(item => item.id === itemId)
        if (item) {
          item.quantity = quantity
        }
      })
      get().calculateTotals()
    },

    clearCart: () => {
      set(state => {
        state.items = []
        state.total = 0
        state.itemCount = 0
      })
    },

    calculateTotals: () => {
      set(state => {
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
      })
    },
  }))
)
