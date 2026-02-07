import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download } from "lucide-react"

const statusVariant: Record<string, "success" | "warning" | "destructive"> = { Completed: "success", Pending: "warning", Failed: "destructive" }

const demo = [
  { id: "ORD-001", user: "Rahul Sharma", product: "Pro Plan", amount: 2999, status: "Completed" as const, date: "2024-11-01" },
  { id: "ORD-002", user: "Priya Patel", product: "Starter Plan", amount: 999, status: "Completed" as const, date: "2024-10-28" },
  { id: "ORD-003", user: "Amit Kumar", product: "Enterprise Plan", amount: 9999, status: "Pending" as const, date: "2024-10-25" },
  { id: "ORD-004", user: "Sneha Gupta", product: "Reseller Plan", amount: 19999, status: "Completed" as const, date: "2024-10-20" },
  { id: "ORD-005", user: "Vikram Singh", product: "Pro Plan", amount: 2999, status: "Failed" as const, date: "2024-10-18" },
  { id: "ORD-006", user: "Meera Joshi", product: "Starter Plan", amount: 999, status: "Completed" as const, date: "2024-10-15" },
]

export function OrdersPage() {
  const [search, setSearch] = useState("")
  const filtered = demo.filter((o) => search === "" || o.user.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Orders</h1><p className="text-muted-foreground">Track all order transactions</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search orders..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Order ID</TableHead><TableHead>User</TableHead><TableHead>Product</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-sm">{o.id}</TableCell>
                  <TableCell className="font-medium">{o.user}</TableCell>
                  <TableCell>{o.product}</TableCell>
                  <TableCell className="font-medium">&#8377;{o.amount.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={statusVariant[o.status]}>{o.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{o.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
