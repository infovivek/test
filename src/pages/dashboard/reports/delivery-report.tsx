import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download, RefreshCw } from "lucide-react"

interface DeliveryRecord {
  id: string; phone: string; instance: string; type: string; status: "Sent" | "Delivered" | "Read" | "Failed"; timestamp: string
}

const statusVariant: Record<string, "success" | "destructive" | "warning" | "secondary"> = {
  Sent: "secondary", Delivered: "success", Read: "success", Failed: "destructive",
}

const demo: DeliveryRecord[] = [
  { id: "1", phone: "+91 98765 43210", instance: "Sales-Team", type: "text", status: "Delivered", timestamp: "2024-11-01 10:30:00" },
  { id: "2", phone: "+91 87654 32109", instance: "Support-Bot", type: "image", status: "Read", timestamp: "2024-11-01 10:28:00" },
  { id: "3", phone: "+91 76543 21098", instance: "Sales-Team", type: "text", status: "Failed", timestamp: "2024-11-01 10:25:00" },
  { id: "4", phone: "+91 65432 10987", instance: "Marketing-WA", type: "document", status: "Sent", timestamp: "2024-11-01 10:20:00" },
  { id: "5", phone: "+91 54321 09876", instance: "Sales-Team", type: "text", status: "Delivered", timestamp: "2024-11-01 10:15:00" },
  { id: "6", phone: "+91 43210 98765", instance: "Support-Bot", type: "video", status: "Read", timestamp: "2024-11-01 10:10:00" },
]

export function DeliveryReportPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const filtered = demo.filter((r) => {
    if (search && !r.phone.includes(search) && !r.instance.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "All" && r.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Delivery Report</h1><p className="text-muted-foreground">Track message delivery status</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: "All", label: "All Status" }, { value: "Sent", label: "Sent" }, { value: "Delivered", label: "Delivered" }, { value: "Read", label: "Read" }, { value: "Failed", label: "Failed" }]} />
            <Input type="date" className="w-auto" />
            <Input type="date" className="w-auto" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Phone</TableHead><TableHead>Instance</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Timestamp</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.phone}</TableCell>
                  <TableCell>{r.instance}</TableCell>
                  <TableCell className="capitalize">{r.type}</TableCell>
                  <TableCell><Badge variant={statusVariant[r.status]}>{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
