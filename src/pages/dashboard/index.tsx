import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/stores/auth-store"
import {
  Cpu,
  Send,
  MessageCircle,
  Users,
  CheckCheck,
  Clock,
  AlertCircle,
  TrendingUp,
} from "lucide-react"

const stats = [
  { label: "Total Instances", value: "12", icon: Cpu, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Connected", value: "8", icon: CheckCheck, color: "text-green-600", bg: "bg-green-50" },
  { label: "Broadcasts Sent", value: "156", icon: Send, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Messages Today", value: "2,847", icon: MessageCircle, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Active Users", value: "45", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Pending Queue", value: "23", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Failed Today", value: "5", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  { label: "Delivery Rate", value: "98.5%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
]

const recentActivity = [
  { action: "Broadcast completed", detail: "Campaign 'Diwali Offer' sent to 500 contacts", time: "2 min ago", status: "success" },
  { action: "New instance connected", detail: "Instance 'Sales-WA' is now online", time: "15 min ago", status: "success" },
  { action: "Broadcast failed", detail: "Campaign 'Weekly Update' - 3 messages failed", time: "1 hour ago", status: "error" },
  { action: "New user registered", detail: "Rahul Sharma joined as reseller", time: "2 hours ago", status: "info" },
  { action: "Chatbot activated", detail: "Bot 'Support-Bot' on instance 'Help-Desk'", time: "3 hours ago", status: "success" },
]

export function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Admin"}</h1>
        <p className="text-muted-foreground">Here's an overview of your messaging platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div
                    className={`h-2 w-2 rounded-full mt-2 ${
                      item.status === "success"
                        ? "bg-green-500"
                        : item.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Message Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: "Sent", value: 2450, total: 2847, color: "bg-blue-500" },
                { label: "Delivered", value: 2380, total: 2847, color: "bg-green-500" },
                { label: "Read", value: 1890, total: 2847, color: "bg-purple-500" },
                { label: "Failed", value: 5, total: 2847, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all`}
                      style={{ width: `${(item.value / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
