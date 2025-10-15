import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { type CartItem } from './use-cart-store'

// Define types
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'

export type OrderItem = {
  id: string
  name: string
  price: number
  quantity: number
  category: string
}

export type Order = {
  id: string
  orderNumber: string
  items: OrderItem[]
  total: number
  tax: number
  subtotal: number
  status: OrderStatus
  customerName?: string
  customerType: 'walk-in' | 'regular'
  paymentMethod: 'cash' | 'card' | 'GCash' | 'GrabPay' | 'PayMaya' | 'Credit Card'
  notes?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export type OrdersStoreState = {
  orders: Order[]
  todaysOrders: Order[]
  dailyStats: {
    totalSales: number
    totalOrders: number
    averageOrderValue: number
    completedOrders: number
  }
}

export type OrdersStoreActions = {
  createOrder: (items: CartItem[], paymentDetails: { paymentMethod: 'cash' | 'card' | 'GCash' | 'GrabPay' | 'PayMaya' | 'Credit Card'; customerName?: string; notes?: string }) => string
  updateOrderStatus: (orderId: string, status: OrderStatus) => void
  cancelOrder: (orderId: string) => void
  getOrderById: (orderId: string) => Order | undefined
  getOrdersByStatus: (status: OrderStatus) => Order[]
  calculateDailyStats: () => void
  initializeDefaultOrders: () => void
}

// Default state constant
export const DEFAULT_ORDERS_STORE_STATE: OrdersStoreState = {
  orders: [],
  todaysOrders: [],
  dailyStats: {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    completedOrders: 0,
  },
}

// Combined store type
export type OrdersStore = OrdersStoreState & OrdersStoreActions

// Helper function to generate order number
const generateOrderNumber = (): string => {
  const today = new Date()
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '')
  const orderCount = Math.floor(Math.random() * 1000) + 1
  return `ORD${dateStr}${orderCount.toString().padStart(3, '0')}`
}

// Helper function to calculate tax (8% for this example)
const calculateTax = (subtotal: number): number => {
  return Math.round(subtotal * 0.08 * 100) / 100
}

// Create and export the store hook
export const useOrdersStore = create(
  immer<OrdersStore>((set, get) => ({
    ...DEFAULT_ORDERS_STORE_STATE,

    /* Actions */
    createOrder: (items, paymentDetails) => {
      let orderId = ''
      
      set(state => {
        const now = new Date()
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const tax = calculateTax(subtotal)
        const total = subtotal + tax

        const order: Order = {
          id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderNumber: generateOrderNumber(),
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
          })),
          subtotal,
          tax,
          total,
          status: 'pending',
          customerType: paymentDetails.customerName ? 'regular' : 'walk-in',
          customerName: paymentDetails.customerName,
          paymentMethod: paymentDetails.paymentMethod,
          notes: paymentDetails.notes,
          createdAt: now,
          updatedAt: now,
        }

        orderId = order.id
        state.orders.unshift(order) // Add to beginning of array for newest first
      })

      get().calculateDailyStats()
      return orderId
    },

    updateOrderStatus: (orderId, status) => {
      set(state => {
        const order = state.orders.find(order => order.id === orderId)
        if (order) {
          order.status = status
          order.updatedAt = new Date()
          
          if (status === 'completed') {
            order.completedAt = new Date()
          }
        }
      })
      get().calculateDailyStats()
    },

    cancelOrder: (orderId) => {
      set(state => {
        const order = state.orders.find(order => order.id === orderId)
        if (order && order.status !== 'completed') {
          order.status = 'cancelled'
          order.updatedAt = new Date()
        }
      })
      get().calculateDailyStats()
    },

    getOrderById: (orderId) => {
      return get().orders.find(order => order.id === orderId)
    },

    getOrdersByStatus: (status) => {
      return get().orders.filter(order => order.status === status)
    },

    calculateDailyStats: () => {
      set(state => {
        const today = new Date().toDateString()
        const todaysOrders = state.orders.filter(order => 
          order.createdAt.toDateString() === today
        )

        const completedOrders = todaysOrders.filter(order => order.status === 'completed')
        const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0)
        const totalOrders = todaysOrders.length
        const averageOrderValue = totalOrders > 0 ? totalSales / completedOrders.length : 0

        state.todaysOrders = todaysOrders
        state.dailyStats = {
          totalSales: Math.round(totalSales * 100) / 100,
          totalOrders,
          averageOrderValue: Math.round(averageOrderValue * 100) / 100,
          completedOrders: completedOrders.length,
        }
      })
    },

    initializeDefaultOrders: () => {
      set(state => {
        if (state.orders.length === 0) {
          const now = new Date()
          const defaultOrders: Omit<Order, 'id' | 'orderNumber'>[] = [
            {
              items: [
                { id: '1', name: 'Americano', price: 4.50, quantity: 1, category: 'Coffee' },
                { id: '2', name: 'Croissant', price: 3.50, quantity: 1, category: 'Pastries' },
              ],
              subtotal: 8.00,
              tax: 0.64,
              total: 8.64,
              status: 'completed',
              customerType: 'walk-in',
              paymentMethod: 'cash',
              createdAt: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes ago
              updatedAt: new Date(now.getTime() - 8 * 60 * 1000),
              completedAt: new Date(now.getTime() - 8 * 60 * 1000),
            },
            {
              items: [
                { id: '3', name: 'Latte', price: 5.50, quantity: 2, category: 'Coffee' },
              ],
              subtotal: 11.00,
              tax: 0.88,
              total: 11.88,
              status: 'preparing',
              customerType: 'walk-in',
              paymentMethod: 'card',
              createdAt: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
              updatedAt: new Date(now.getTime() - 3 * 60 * 1000),
            },
            {
              items: [
                { id: '4', name: 'Cappuccino', price: 5.00, quantity: 1, category: 'Coffee' },
                { id: '5', name: 'Blueberry Muffin', price: 4.00, quantity: 1, category: 'Pastries' },
              ],
              subtotal: 9.00,
              tax: 0.72,
              total: 9.72,
              status: 'completed',
              customerType: 'regular',
              customerName: 'John Doe',
              paymentMethod: 'card',
              createdAt: new Date(now.getTime() - 15 * 60 * 1000), // 15 minutes ago
              updatedAt: new Date(now.getTime() - 10 * 60 * 1000),
              completedAt: new Date(now.getTime() - 10 * 60 * 1000),
            },
          ]

          defaultOrders.forEach((orderData, index) => {
            const order: Order = {
              ...orderData,
              id: `order_${Date.now() - index}_${Math.random().toString(36).substr(2, 9)}`,
              orderNumber: generateOrderNumber(),
            }
            state.orders.push(order)
          })
        }
      })
      get().calculateDailyStats()
    },
  }))
)
