import React from 'react'
import { Coffee } from 'lucide-react'

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center mb-6 sm:mb-8">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-2 sm:p-3 bg-orange-500 rounded-xl">
          <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            The Coffee Realm
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">North Fairview</p>
        </div>
      </div>
    </div>
  )
}
