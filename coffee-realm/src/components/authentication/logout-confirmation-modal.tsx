import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoutConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}) => {
  console.log('LogoutConfirmationModal rendered with isOpen:', isOpen, 'loading:', loading)
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <LogOut className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            {/* Confirmation Content */}
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Confirm Logout
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                Are you sure you want to sign out of your account?
              </DialogDescription>
            </div>

          </div>
        </DialogHeader>

        {/* Dialog Footer */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className={cn(
              "w-full sm:w-auto",
              "border-gray-200 text-gray-700 hover:bg-gray-50",
              "transition-colors"
            )}
            >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "w-full sm:w-auto",
              "bg-orange-500 hover:bg-orange-600 text-white",
              "transition-colors"
            )}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing out...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
