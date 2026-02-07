import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { api } from "@/lib/api"
import type { Instance } from "@/types"
import {
  Plus,
  Search,
  RefreshCw,
  Wifi,
  WifiOff,
  Settings,
  Trash2,
  QrCode,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react"

export function InstancesPage() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [connectionFilter, setConnectionFilter] = useState("All")
  const [webhookFilter, setWebhookFilter] = useState("All")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null)
  const [newInstanceName, setNewInstanceName] = useState("")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchInstances()
  }, [search, connectionFilter, webhookFilter])

  const fetchInstances = async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = { search }
      if (connectionFilter !== "All") params.connection_status = connectionFilter
      if (webhookFilter !== "All") params.webhook_status = webhookFilter
      const res = await api.get("/instances", { params })
      setInstances(res.data.data || [])
    } catch {
      setInstances(demoInstances)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newInstanceName.trim()) return
    setCreating(true)
    try {
      await api.post("/instances", { instance_name: newInstanceName })
      setShowCreateDialog(false)
      setNewInstanceName("")
      fetchInstances()
    } catch {
      setShowCreateDialog(false)
    } finally {
      setCreating(false)
    }
  }

  const handleShowQR = (instance: Instance) => {
    setSelectedInstance(instance)
    setShowQRDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this instance?")) return
    try {
      await api.delete(`/instances/${id}`)
      fetchInstances()
    } catch {
      // silently fail
    }
  }

  const filtered = instances.filter((i) => {
    if (search && !i.instance_name.toLowerCase().includes(search.toLowerCase())) return false
    if (connectionFilter !== "All" && i.connection_status !== connectionFilter) return false
    if (webhookFilter !== "All" && i.webhook_status !== webhookFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">WhatsApp Instances</h1>
          <p className="text-muted-foreground">Manage your WhatsApp connections</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4" /> New Instance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search instances..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              value={connectionFilter}
              onChange={(e) => setConnectionFilter(e.target.value)}
              options={[
                { value: "All", label: "All Status" },
                { value: "Connected", label: "Connected" },
                { value: "Disconnected", label: "Disconnected" },
              ]}
            />
            <Select
              value={webhookFilter}
              onChange={(e) => setWebhookFilter(e.target.value)}
              options={[
                { value: "All", label: "All Webhooks" },
                { value: "Enabled", label: "Enabled" },
                { value: "Disabled", label: "Disabled" },
              ]}
            />
            <Button variant="outline" size="icon" onClick={fetchInstances}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 skeleton rounded-md" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instance Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Connection</TableHead>
                  <TableHead>Webhook</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No instances found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((instance) => (
                    <TableRow key={instance.id}>
                      <TableCell className="font-medium">{instance.instance_name}</TableCell>
                      <TableCell>{instance.phone_number || "Not linked"}</TableCell>
                      <TableCell>
                        <Badge variant={instance.connection_status === "Connected" ? "success" : "destructive"}>
                          {instance.connection_status === "Connected" ? (
                            <Wifi className="h-3 w-3 mr-1" />
                          ) : (
                            <WifiOff className="h-3 w-3 mr-1" />
                          )}
                          {instance.connection_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={instance.webhook_status === "Enabled" ? "success" : "secondary"}>
                          {instance.webhook_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(instance.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleShowQR(instance)} title="QR Code">
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Webhook URL">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Settings">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Open" >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(instance.id)} title="Delete">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent onClose={() => setShowCreateDialog(false)}>
          <DialogHeader>
            <DialogTitle>Create New Instance</DialogTitle>
            <DialogDescription>Enter a name for your new WhatsApp instance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              placeholder="Instance name"
              value={newInstanceName}
              onChange={(e) => setNewInstanceName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={creating}>
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent onClose={() => setShowQRDialog(false)}>
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
            <DialogDescription>
              Scan this QR code with WhatsApp on your phone to connect "{selectedInstance?.instance_name}"
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="h-64 w-64 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <QrCode className="h-16 w-16 mx-auto mb-2" />
                <p className="text-sm">QR Code will appear here</p>
                <p className="text-xs">Connect instance to generate</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const demoInstances: Instance[] = [
  {
    id: "1",
    instance_name: "Sales-Team",
    phone_number: "+91 98765 43210",
    connection_status: "Connected",
    webhook_status: "Enabled",
    webhook_url: "https://example.com/webhook",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    instance_name: "Support-Bot",
    phone_number: "+91 99887 76655",
    connection_status: "Connected",
    webhook_status: "Enabled",
    created_at: "2024-02-01T10:00:00Z",
    updated_at: "2024-02-01T10:00:00Z",
  },
  {
    id: "3",
    instance_name: "Marketing-WA",
    phone_number: "",
    connection_status: "Disconnected",
    webhook_status: "Disabled",
    created_at: "2024-03-10T10:00:00Z",
    updated_at: "2024-03-10T10:00:00Z",
  },
  {
    id: "4",
    instance_name: "Customer-Service",
    phone_number: "+91 91234 56789",
    connection_status: "Connected",
    webhook_status: "Enabled",
    created_at: "2024-04-05T10:00:00Z",
    updated_at: "2024-04-05T10:00:00Z",
  },
  {
    id: "5",
    instance_name: "Notifications",
    phone_number: "+91 87654 32109",
    connection_status: "Disconnected",
    webhook_status: "Disabled",
    created_at: "2024-05-20T10:00:00Z",
    updated_at: "2024-05-20T10:00:00Z",
  },
]
