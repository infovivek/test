import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download, Wifi, WifiOff } from "lucide-react"

const demo = [
  { id: "1", instance: "Sales-Team", phone: "+91 98765 43210", status: "Connected" as const, lastConnected: "2024-11-01 10:00:00", uptime: "99.8%" },
  { id: "2", instance: "Support-Bot", phone: "+91 87654 32109", status: "Connected" as const, lastConnected: "2024-11-01 09:00:00", uptime: "99.5%" },
  { id: "3", instance: "Marketing-WA", phone: "+91 76543 21098", status: "Disconnected" as const, lastConnected: "2024-10-30 15:00:00", uptime: "85.2%" },
  { id: "4", instance: "Customer-Service", phone: "+91 65432 10987", status: "Connected" as const, lastConnected: "2024-11-01 08:00:00", uptime: "98.9%" },
  { id: "5", instance: "Notifications", phone: "+91 54321 09876", status: "Disconnected" as const, lastConnected: "2024-10-28 12:00:00", uptime: "72.1%" },
]

export function ConnectionReportPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const filtered = demo.filter((r) => {
    if (search && !r.instance.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "All" && r.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Connection Report</h1><p className="text-muted-foreground">Monitor WhatsApp instance connections</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: "All", label: "All" }, { value: "Connected", label: "Connected" }, { value: "Disconnected", label: "Disconnected" }]} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Instance</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Last Connected</TableHead><TableHead>Uptime</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.instance}</TableCell>
                  <TableCell className="font-mono text-sm">{r.phone}</TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Connected" ? "success" : "destructive"}>
                      {r.status === "Connected" ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.lastConnected}</TableCell>
                  <TableCell className="font-medium">{r.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
