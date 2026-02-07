import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/select"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download } from "lucide-react"

const statusVariant: Record<string, "success" | "destructive" | "warning"> = {
  Active: "success", Expired: "destructive", "Expiring Soon": "warning",
}

const demo = [
  { id: "1", user: "Rahul Sharma", instance: "Sales-Team", quota: 5000, used: 3200, validity: "30 days", expiry: "2024-12-01", status: "Active" as const },
  { id: "2", user: "Priya Patel", instance: "Support-Bot", quota: 2000, used: 1950, validity: "15 days", expiry: "2024-11-10", status: "Expiring Soon" as const },
  { id: "3", user: "Amit Kumar", instance: "Marketing-WA", quota: 10000, used: 10000, validity: "0 days", expiry: "2024-10-25", status: "Expired" as const },
  { id: "4", user: "Sneha Gupta", instance: "Customer-Service", quota: 3000, used: 800, validity: "45 days", expiry: "2024-12-15", status: "Active" as const },
  { id: "5", user: "Vikram Singh", instance: "Notifications", quota: 1000, used: 990, validity: "3 days", expiry: "2024-11-04", status: "Expiring Soon" as const },
  { id: "6", user: "Meera Joshi", instance: "Sales-Team", quota: 5000, used: 4500, validity: "20 days", expiry: "2024-11-21", status: "Active" as const },
]

export function ExpiryReportPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const filtered = demo.filter((r) => {
    if (search && !r.user.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== "All" && r.status !== statusFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Expiry Report</h1><p className="text-muted-foreground">Track quota and validity expiration</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: "All", label: "All" }, { value: "Active", label: "Active" }, { value: "Expiring Soon", label: "Expiring Soon" }, { value: "Expired", label: "Expired" }]} />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Instance</TableHead><TableHead>Quota</TableHead><TableHead>Used</TableHead><TableHead>Validity</TableHead><TableHead>Expiry</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.user}</TableCell>
                  <TableCell>{r.instance}</TableCell>
                  <TableCell>{r.quota.toLocaleString()}</TableCell>
                  <TableCell>{r.used.toLocaleString()}</TableCell>
                  <TableCell>{r.validity}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.expiry}</TableCell>
                  <TableCell><Badge variant={statusVariant[r.status]}>{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
