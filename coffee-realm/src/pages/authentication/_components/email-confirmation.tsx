import React from 'react'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailConfirmationProps {
  email: string
  onBackToSignIn: () => void
  onResendConfirmation: () => void
}

export const EmailConfirmation: React.FC<EmailConfirmationProps> = ({
  email,
  onBackToSignIn,
  onResendConfirmation
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
          <Mail className="h-8 w-8 text-orange-500" />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            We sent a confirmation link to
          </p>
          <p className="font-medium text-gray-900">{email}</p>
          <p className="text-sm text-gray-500">
            Click the link in the email to activate your account, then come back here to sign in.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button
          type="button"
          onClick={onBackToSignIn}
          className={cn(
            "w-full h-11 bg-orange-500 hover:bg-orange-600",
            "text-white font-medium rounded-lg",
            "transition-colors"
          )}
        >
          Back to Sign In
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={onResendConfirmation}
          className={cn(
            "w-full h-10 border-gray-200 rounded-lg",
            "hover:bg-gray-50 text-gray-700 font-medium",
            "transition-colors"
          )}
        >
          Resend Confirmation Email
        </Button>
      </div>
    </div>
  )
}
