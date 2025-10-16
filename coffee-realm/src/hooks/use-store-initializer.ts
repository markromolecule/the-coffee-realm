import { useEffect } from 'react'
import { useInventoryStore } from '@/stores/use-inventory-store'
import { useOrdersStore } from '@/stores/use-orders-store'

export const useStoreInitializer = () => {
  const initializeInventory = useInventoryStore(state => state.initializeDefaultItems)
  const initializeOrders = useOrdersStore(state => state.initializeDefaultOrders)

  useEffect(() => {
    // Initialize stores with default data
    initializeInventory()
    initializeOrders()
  }, [initializeInventory, initializeOrders])
}
