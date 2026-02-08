import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download } from "lucide-react"

const demo = [
  { id: "RCH-001", user: "Rahul Sharma", amount: 2999, plan: "Pro Plan", method: "UPI", status: "Success" as const, date: "2024-11-01" },
  { id: "RCH-002", user: "Priya Patel", amount: 999, plan: "Starter Plan", method: "Card", status: "Success" as const, date: "2024-10-28" },
  { id: "RCH-003", user: "Amit Kumar", amount: 5000, plan: "Wallet Top-up", method: "Net Banking", status: "Failed" as const, date: "2024-10-25" },
  { id: "RCH-004", user: "Sneha Gupta", amount: 19999, plan: "Reseller Plan", method: "UPI", status: "Success" as const, date: "2024-10-20" },
  { id: "RCH-005", user: "Vikram Singh", amount: 2999, plan: "Pro Plan", method: "Card", status: "Pending" as const, date: "2024-10-18" },
  { id: "RCH-006", user: "Meera Joshi", amount: 999, plan: "Starter Plan", method: "UPI", status: "Success" as const, date: "2024-10-15" },
]

const statusVariant: Record<string, "success" | "destructive" | "warning"> = { Success: "success", Failed: "destructive", Pending: "warning" }

export function RechargeHistoryPage() {
  const [search, setSearch] = useState("")
  const filtered = demo.filter((r) => search === "" || r.user.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Recharge History</h1><p className="text-muted-foreground">Track all recharge transactions</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Plan</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.user}</TableCell>
                  <TableCell className="font-medium">&#8377;{r.amount.toLocaleString()}</TableCell>
                  <TableCell>{r.plan}</TableCell>
                  <TableCell>{r.method}</TableCell>
                  <TableCell><Badge variant={statusVariant[r.status]}>{r.status}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
