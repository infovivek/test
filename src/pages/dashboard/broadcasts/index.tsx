import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { api } from "@/lib/api"
import type { Broadcast } from "@/types"
import { Plus, Search, RefreshCw, Eye, Copy, Trash2 } from "lucide-react"

const statusColors: Record<string, "success" | "warning" | "destructive" | "secondary" | "default"> = {
  Completed: "success",
  Processing: "warning",
  Pending: "secondary",
  Failed: "destructive",
  Scheduled: "default",
}

export function BroadcastsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchBroadcasts()
  }, [])

  const fetchBroadcasts = async () => {
    setLoading(true)
    try {
      const res = await api.get("/broadcasts", { params: { search } })
      setBroadcasts(res.data.data || [])
    } catch {
      setBroadcasts(demoBroadcasts)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Broadcasts</h1>
          <p className="text-muted-foreground">Create and manage bulk message campaigns</p>
        </div>
        <Link to="/dashboard/broadcasts/create">
          <Button>
            <Plus className="h-4 w-4" /> New Broadcast
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search broadcasts..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchBroadcasts}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 skeleton rounded-md" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Instance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {broadcasts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No broadcasts found. Create your first broadcast campaign.
                    </TableCell>
                  </TableRow>
                ) : (
                  broadcasts.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>
                      <TableCell>{b.instance_name}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[b.status]}>{b.status}</Badge>
                      </TableCell>
                      <TableCell>{b.total_recipients}</TableCell>
                      <TableCell className="text-green-600">{b.sent_count}</TableCell>
                      <TableCell className="text-blue-600">{b.delivered_count}</TableCell>
                      <TableCell className="text-red-600">{b.failed_count}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(b.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

const demoBroadcasts: Broadcast[] = [
  { id: "1", name: "Diwali Special Offer", instance_name: "Sales-Team", status: "Completed", total_recipients: 500, sent_count: 498, delivered_count: 485, failed_count: 2, message_type: "image", message_content: "Happy Diwali! Get 50% off on all products.", created_at: "2024-10-25T10:00:00Z", updated_at: "2024-10-25T12:00:00Z" },
  { id: "2", name: "Weekly Newsletter", instance_name: "Marketing-WA", status: "Processing", total_recipients: 1200, sent_count: 650, delivered_count: 640, failed_count: 5, message_type: "text", message_content: "Here's your weekly update...", created_at: "2024-11-01T08:00:00Z", updated_at: "2024-11-01T08:30:00Z" },
  { id: "3", name: "Payment Reminder", instance_name: "Support-Bot", status: "Scheduled", total_recipients: 350, sent_count: 0, delivered_count: 0, failed_count: 0, message_type: "text", message_content: "Reminder: Your payment is due.", scheduled_at: "2024-11-05T09:00:00Z", created_at: "2024-11-01T10:00:00Z", updated_at: "2024-11-01T10:00:00Z" },
  { id: "4", name: "New Product Launch", instance_name: "Sales-Team", status: "Completed", total_recipients: 800, sent_count: 798, delivered_count: 790, failed_count: 2, message_type: "image", message_content: "Check out our new product!", created_at: "2024-10-20T14:00:00Z", updated_at: "2024-10-20T16:00:00Z" },
  { id: "5", name: "Service Update", instance_name: "Customer-Service", status: "Failed", total_recipients: 200, sent_count: 50, delivered_count: 45, failed_count: 150, message_type: "text", message_content: "Important service update.", created_at: "2024-10-28T11:00:00Z", updated_at: "2024-10-28T11:30:00Z" },
]
