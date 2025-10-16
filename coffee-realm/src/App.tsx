import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/auth-provider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Login } from '@/pages/Login'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Overview } from '@/pages/dashboard/Overview'
import { POSTerminal } from '@/pages/dashboard/POSTerminal'
import { Orders } from '@/pages/dashboard/Orders'
import { Inventory } from '@/pages/dashboard/Inventory'
import { useStoreInitializer } from '@/hooks/use-store-initializer'
import { Analytics } from '@vercel/analytics/react'
import './App.css'

function App() {
  // Initialize stores with default data
  useStoreInitializer()
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested Dashboard Routes */}
            <Route index element={<Overview />} />
            <Route path="pos" element={<POSTerminal />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>

          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Analytics />
    </AuthProvider>
  )
}

export default App
