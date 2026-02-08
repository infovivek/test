import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Send, CheckCheck, AlertCircle, Clock } from "lucide-react"

const stats = [
  { label: "Total Sent", value: "2,847", icon: Send, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Delivered", value: "2,780", icon: CheckCheck, color: "text-green-600", bg: "bg-green-50" },
  { label: "Failed", value: "12", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
  { label: "In Queue", value: "55", icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
]

const demo = [
  { id: "1", user: "Rahul Sharma", instance: "Sales-Team", sent: 450, delivered: 445, failed: 2, lastActive: "10:30 AM" },
  { id: "2", user: "Priya Patel", instance: "Support-Bot", sent: 320, delivered: 318, failed: 1, lastActive: "10:28 AM" },
  { id: "3", user: "Amit Kumar", instance: "Marketing-WA", sent: 890, delivered: 875, failed: 5, lastActive: "10:15 AM" },
  { id: "4", user: "Sneha Gupta", instance: "Customer-Service", sent: 210, delivered: 208, failed: 0, lastActive: "9:45 AM" },
  { id: "5", user: "Vikram Singh", instance: "Notifications", sent: 560, delivered: 545, failed: 3, lastActive: "10:25 AM" },
  { id: "6", user: "Meera Joshi", instance: "Sales-Team", sent: 417, delivered: 389, failed: 1, lastActive: "10:00 AM" },
]

export function TodayUsagePage() {
  const [search, setSearch] = useState("")
  const filtered = demo.filter((u) => search === "" || u.user.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold">Today's Usage</h1><p className="text-muted-foreground">Real-time messaging statistics for today</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => { const Icon = s.icon; return (
          <Card key={s.label}><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></div><div className={`h-12 w-12 rounded-lg ${s.bg} ${s.color} flex items-center justify-center`}><Icon className="h-6 w-6" /></div></div></CardContent></Card>
        )})}
      </div>
      <Card>
        <CardHeader>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Instance</TableHead><TableHead>Sent</TableHead><TableHead>Delivered</TableHead><TableHead>Failed</TableHead><TableHead>Last Active</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.user}</TableCell>
                  <TableCell>{u.instance}</TableCell>
                  <TableCell className="text-blue-600 font-medium">{u.sent}</TableCell>
                  <TableCell className="text-green-600 font-medium">{u.delivered}</TableCell>
                  <TableCell className="text-red-600 font-medium">{u.failed}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{u.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
