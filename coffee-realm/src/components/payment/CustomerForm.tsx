import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CustomerFormProps {
  customerName: string
  customerEmail: string
  customerPhone: string
  onNameChange: (name: string) => void
  onEmailChange: (email: string) => void
  onPhoneChange: (phone: string) => void
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customerName,
  customerEmail,
  customerPhone,
  onNameChange,
  onEmailChange,
  onPhoneChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name *</Label>
        <Input
          id="customerName"
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => onNameChange(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Customer Email (Optional)</Label>
        <Input
          id="email"
          type="email"
          placeholder="customer@example.com"
          value={customerEmail}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Customer Phone (Optional)</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+63 912 345 6789"
          value={customerPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>
    </div>
  )
}
