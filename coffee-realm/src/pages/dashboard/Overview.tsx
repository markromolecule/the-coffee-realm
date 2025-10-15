import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { xenditService } from '@/lib/xendit'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Coffee,
  Users,
  Clock,
  Star
} from 'lucide-react'

const stats = [
  {
    title: "Today's Sales",
    value: "$1,245.67",
    description: "+12.5% from yesterday",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Orders",
    value: "89",
    description: "24 pending",
    icon: ShoppingCart,
    trend: "up"
  },
  {
    title: "Low Stock Items",
    value: "7",
    description: "Need restock",
    icon: Package,
    trend: "down"
  },
  {
    title: "Avg. Order Value",
    value: "$14.23",
    description: "+3.2% from last week",
    icon: TrendingUp,
    trend: "up"
  }
]

const recentOrders = [
  {
    id: "#001",
    customer: "Walk-in Customer",
    items: ["Espresso", "Croissant"],
    total: 8.50,
    status: "completed",
    time: "2 mins ago"
  },
  {
    id: "#002",
    customer: "Walk-in Customer",
    items: ["Latte", "Blueberry Muffin"],
    total: 12.75,
    status: "preparing",
    time: "5 mins ago"
  },
  {
    id: "#003",
    customer: "Walk-in Customer",
    items: ["Cappuccino", "Sandwich"],
    total: 15.25,
    status: "completed",
    time: "8 mins ago"
  }
]

const topProducts = [
  { name: "Americano", sales: 45, revenue: 180.00 },
  { name: "Latte", sales: 38, revenue: 190.00 },
  { name: "Cappuccino", sales: 32, revenue: 160.00 },
  { name: "Espresso", sales: 28, revenue: 98.00 },
]

export const Overview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Good morning! ☕</h2>
        <p className="text-muted-foreground">
          Here's what's happening at your coffee shop today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
            <CardDescription>Latest customer orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge 
                        variant={order.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-sm">{order.items.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₱ {xenditService.formatAmount(order.total).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Products
            </CardTitle>
            <CardDescription>Best selling items today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <p className="font-medium">₱ {xenditService.formatAmount(product.revenue).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <ShoppingCart className="h-8 w-8 text-orange-600 mb-2" />
              <p className="font-medium">New Order</p>
              <p className="text-sm text-muted-foreground">Start POS</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Package className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium">Check Inventory</p>
              <p className="text-sm text-muted-foreground">Stock levels</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium">Staff Schedule</p>
              <p className="text-sm text-muted-foreground">Manage team</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-medium">View Reports</p>
              <p className="text-sm text-muted-foreground">Analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
