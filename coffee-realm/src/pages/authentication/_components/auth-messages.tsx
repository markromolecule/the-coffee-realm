import React from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AuthMessagesProps {
  error: string | null
  success: string | null
}

export const AuthMessages: React.FC<AuthMessagesProps> = ({ error, success }) => {
  return (
    <>
      {/* Error Message */}
      {error && (
        <div className={cn(
          "flex items-center space-x-2 p-3 rounded-lg",
          "bg-red-50 border border-red-200 text-red-600"
        )}>
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className={cn(
          "flex items-center space-x-2 p-3 rounded-lg",
          "bg-green-50 border border-green-200 text-green-600"
        )}>
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}
    </>
  )
}
