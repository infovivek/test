import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download } from "lucide-react"

const statusVariant: Record<string, "warning" | "success" | "secondary" | "destructive"> = {
  Queued: "secondary", Processing: "warning", Sent: "success", Failed: "destructive",
}

const demo = [
  { id: "1", phone: "+91 98765 43210", instance: "Sales-Team", message: "Diwali Offer!", status: "Queued" as const, position: 1, created: "2024-11-01 10:30:00" },
  { id: "2", phone: "+91 87654 32109", instance: "Sales-Team", message: "Weekly Update", status: "Processing" as const, position: 2, created: "2024-11-01 10:28:00" },
  { id: "3", phone: "+91 76543 21098", instance: "Marketing-WA", message: "New Product!", status: "Queued" as const, position: 3, created: "2024-11-01 10:25:00" },
  { id: "4", phone: "+91 65432 10987", instance: "Support-Bot", message: "Payment Reminder", status: "Sent" as const, position: 0, created: "2024-11-01 10:20:00" },
  { id: "5", phone: "+91 54321 09876", instance: "Sales-Team", message: "Follow Up", status: "Failed" as const, position: 0, created: "2024-11-01 10:15:00" },
]

export function QueueReportPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const filtered = demo.filter((r) => {
    if (search && !r.phone.includes(search)) return false
    if (statusFilter !== "All" && r.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Queue Report</h1><p className="text-muted-foreground">Monitor message queue status</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: "All", label: "All" }, { value: "Queued", label: "Queued" }, { value: "Processing", label: "Processing" }, { value: "Sent", label: "Sent" }, { value: "Failed", label: "Failed" }]} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Phone</TableHead><TableHead>Instance</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead>Position</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.phone}</TableCell>
                  <TableCell>{r.instance}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{r.message}</TableCell>
                  <TableCell><Badge variant={statusVariant[r.status]}>{r.status}</Badge></TableCell>
                  <TableCell>{r.position > 0 ? `#${r.position}` : "-"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
