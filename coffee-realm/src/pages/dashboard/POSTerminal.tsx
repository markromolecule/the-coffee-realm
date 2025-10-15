import React, { useState, useEffect } from 'react'
import { useInventoryStore } from '@/stores/use-inventory-store'
import { useCartStore } from '@/stores/use-cart-store'
import { useOrdersStore } from '@/stores/use-orders-store'
import { PaymentModal } from '@/components/PaymentModal'
import { CategoryNavigation } from '@/components/pos/CategoryNavigation'
import { ProductGrid } from '@/components/pos/ProductGrid'
import { ShoppingCartComponent } from '@/components/pos/ShoppingCart'
import { PaymentNotification } from '@/components/pos/PaymentNotification'

export const POSTerminal: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentResult, setPaymentResult] = useState<'success' | 'failed' | null>(null)
  
  // Store hooks
  const { items: inventoryItems, categories } = useInventoryStore()
  const { items: cartItems, total, itemCount, addItem, removeItem, updateQuantity, clearCart } = useCartStore()
  const { createOrder } = useOrdersStore()

  // Filter items by category and active status
  const filteredItems = selectedCategory === 'All' 
    ? inventoryItems.filter(item => item.isActive && item.stock > 0)
    : inventoryItems.filter(item => 
        item.category === selectedCategory && item.isActive && item.stock > 0
      )

  // Categories for navigation
  const allCategories = ['All', ...categories]

  const handleAddToCart = (item: typeof inventoryItems[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image,
    })
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    
    // For card payments, show Xendit payment modal
    if (paymentMethod === 'card') {
      setShowPaymentModal(true)
      return
    }
    
    // For cash payments, process immediately
    const orderId = createOrder(cartItems, {
      paymentMethod,
      customerName: undefined, // Walk-in customer
      notes: undefined,
    })
    
    clearCart()
    alert(`Cash order created successfully! Order ID: ${orderId.slice(-8)}`)
  }

  const handlePaymentSuccess = (invoiceId: string) => {
    // Create order after successful payment
    const orderId = createOrder(cartItems, {
      paymentMethod: 'card',
      customerName: undefined,
      notes: `Xendit Payment - Invoice: ${invoiceId}`,
    })
    
    clearCart()
    setShowPaymentModal(false)
    alert(`Payment successful! Order ID: ${orderId.slice(-8)}`)
  }

  const tax = Math.round(total * 0.08 * 100) / 100
  const grandTotal = total + tax

  // Check for payment result from URL params (when returning from Xendit)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const payment = urlParams.get('payment')
    
    if (payment === 'success') {
      setPaymentResult('success')
      
      // Try to get order data from localStorage first, then from cart
      const storedOrderData = localStorage.getItem('pendingXenditOrder')
      let orderData = null
      
      if (storedOrderData) {
        try {
          orderData = JSON.parse(storedOrderData)
          localStorage.removeItem('pendingXenditOrder') // Clear after use
        } catch (e) {
          console.error('Failed to parse stored order data:', e)
        }
      }
      
      // Create order for successful payment
      if (orderData && orderData.items && orderData.items.length > 0) {
        // Default to 'card' since we're not specifying payment method anymore
        const orderId = createOrder(orderData.items, {
          paymentMethod: 'card',
          customerName: orderData.customerName || 'Xendit Customer',
          notes: 'Xendit Payment - Completed via checkout',
        })
        console.log('Order created from Xendit payment:', orderId)
      } else if (cartItems.length > 0) {
        // Fallback to current cart items
        const orderId = createOrder(cartItems, {
          paymentMethod: 'card',
          customerName: undefined,
          notes: 'Xendit Payment - Completed via checkout',
        })
        clearCart()
        console.log('Order created from cart fallback:', orderId)
      }
      
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setPaymentResult(null), 5000)
    } else if (payment === 'failed') {
      setPaymentResult('failed')
      // Clear stored order data on failure
      localStorage.removeItem('pendingXenditOrder')
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname)
      
      // Auto-hide error message after 5 seconds
      setTimeout(() => setPaymentResult(null), 5000)
    }
  }, [cartItems, createOrder, clearCart])

  return (
    <div className="h-full flex flex-col">
      {/* Payment Result Notifications */}
      <PaymentNotification
        result={paymentResult}
        onDismiss={() => setPaymentResult(null)}
      />

      <div className="flex-1 flex gap-6">
      {/* Left Side - Products */}
      <div className="flex-1 flex flex-col">
        <CategoryNavigation
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ProductGrid
          items={filteredItems}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Right Side - Cart */}
      <ShoppingCartComponent
        items={cartItems}
        total={total}
        tax={tax}
        grandTotal={grandTotal}
        itemCount={itemCount}
        paymentMethod={paymentMethod}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onPaymentMethodChange={setPaymentMethod}
        onCheckout={handleCheckout}
        onClearCart={clearCart}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        items={cartItems}
        total={total}
        tax={tax}
        grandTotal={grandTotal}
        onSuccess={handlePaymentSuccess}
      />
      </div>
    </div>
  )
}
