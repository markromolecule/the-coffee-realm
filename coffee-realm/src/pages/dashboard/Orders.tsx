import React, { useState } from 'react'
import { useOrdersStore } from '@/stores/use-orders-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  FileText,
  Filter,
} from 'lucide-react'
import { xenditService } from '@/lib/xendit'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/stores/use-orders-store'

export const Orders: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  
  // Store hooks
  const { 
    orders, 
    dailyStats, 
    updateOrderStatus, 
    cancelOrder, 
    getOrdersByStatus 
  } = useOrdersStore()

  // Filter orders based on selected status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : getOrdersByStatus(statusFilter)

  // Status configuration
  const statusConfig = {
    pending: { 
      label: 'Pending', 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock 
    },
    preparing: { 
      label: 'Preparing', 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Clock 
    },
    ready: { 
      label: 'Ready', 
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle 
    },
    completed: { 
      label: 'Completed', 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: CheckCircle 
    },
    cancelled: { 
      label: 'Cancelled', 
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle 
    },
  }

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus)
  }

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(orderId)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Daily Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱ {xenditService.formatAmount(dailyStats.totalSales).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {dailyStats.completedOrders} completed orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Orders placed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱ {xenditService.formatAmount(dailyStats.averageOrderValue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per completed order
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => ['pending', 'preparing', 'ready'].includes(order.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Order History
              </CardTitle>
              <CardDescription>
                All orders sorted by most recent
              </CardDescription>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                <Button
                  size="sm"
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={statusFilter === status ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status as OrderStatus)}
                  >
                    {config.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => {
                    const config = statusConfig[order.status]
                    const StatusIcon = config.icon
                    
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{order.orderNumber}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge className={cn('gap-1', config.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{order.items.length - 2} more
                              </div>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <div className="text-sm">
                              {order.customerName || 'Walk-in Customer'}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {order.customerType}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {order.paymentMethod}
                          </Badge>
                        </TableCell>
                        
                        <TableCell className="font-medium">
                          ₱ {xenditService.formatAmount(order.total).toLocaleString()}
                        </TableCell>
                        
                        <TableCell className="text-sm">
                          {formatTime(order.createdAt)}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex gap-1">
                            {order.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                              >
                                Start
                              </Button>
                            )}
                            {order.status === 'preparing' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(order.id, 'ready')}
                              >
                                Ready
                              </Button>
                            )}
                            {order.status === 'ready' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                              >
                                Complete
                              </Button>
                            )}
                            {!['completed', 'cancelled'].includes(order.status) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
