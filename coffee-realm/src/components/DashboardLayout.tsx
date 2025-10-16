import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LogoutConfirmationModal } from '@/components/authentication/logout-confirmation-modal'
import {
  Coffee,
  LayoutDashboard,
  ShoppingCart,
  Package,
  FileText,
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react'

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'POS Terminal',
    href: '/dashboard/pos',
    icon: ShoppingCart,
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: FileText,
  },
  {
    name: 'Inventory',
    href: '/dashboard/inventory',
    icon: Package,
  },
]

export const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Debug state changes
  useEffect(() => {
    console.log('showLogoutModal state changed to:', showLogoutModal)
  }, [showLogoutModal])

  const handleLogoutClick = () => {
    console.log('Logout button clicked!')
    console.log('Current showLogoutModal state:', showLogoutModal)
    setShowLogoutModal(true)
    console.log('Setting showLogoutModal to true')
  }

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true)
    try {
      // Sign out from Supabase
      await signOut()
      
      // Clear any local storage items
      localStorage.clear()
      sessionStorage.clear()
      
      // Clear any cookies (if any are set)
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname
      })
      
      setShowLogoutModal(false)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear local data and navigate to login even if signOut fails
      localStorage.clear()
      sessionStorage.clear()
      setShowLogoutModal(false)
      navigate('/login')
    } finally {
      setLogoutLoading(false)
    }
  }

  const handleLogoutCancel = () => {
    setShowLogoutModal(false)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center">
            <Coffee className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mr-2" />
            <span className="text-lg sm:text-xl font-bold text-gray-800">The Coffee Realm</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-600'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <Separator />

        {/* User section */}
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <Button
            onClick={handleLogoutClick}
            variant="outline"
            size="sm"
            className="w-full"
            disabled={logoutLoading}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 relative z-10 bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>



      {/* Debug indicator */}
      {showLogoutModal && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50">
          Modal should be open: {showLogoutModal.toString()}
        </div>
      )}

      {/* Simple test modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Test Modal</h2>
            <p className="mb-4">This is a test modal to see if it shows up.</p>
            <div className="flex gap-2">
              <button 
                onClick={handleLogoutCancel} 
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogoutConfirm} 
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </div>
  )
}
