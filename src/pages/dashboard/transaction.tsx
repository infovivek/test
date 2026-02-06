import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Search, Download, ArrowUpRight, ArrowDownLeft } from "lucide-react"

const demo = [
  { id: "TXN-001", user: "Rahul Sharma", type: "Credit" as const, amount: 2999, desc: "Pro Plan purchase", date: "2024-11-01" },
  { id: "TXN-002", user: "System", type: "Debit" as const, amount: 500, desc: "Message usage charges", date: "2024-11-01" },
  { id: "TXN-003", user: "Priya Patel", type: "Credit" as const, amount: 999, desc: "Starter Plan purchase", date: "2024-10-28" },
  { id: "TXN-004", user: "Amit Kumar", type: "Credit" as const, amount: 5000, desc: "Wallet recharge", date: "2024-10-25" },
  { id: "TXN-005", user: "System", type: "Debit" as const, amount: 1200, desc: "Broadcast charges", date: "2024-10-24" },
  { id: "TXN-006", user: "Sneha Gupta", type: "Credit" as const, amount: 19999, desc: "Reseller Plan purchase", date: "2024-10-20" },
  { id: "TXN-007", user: "Vikram Singh", type: "Debit" as const, amount: 300, desc: "API usage charges", date: "2024-10-18" },
  { id: "TXN-008", user: "Meera Joshi", type: "Credit" as const, amount: 999, desc: "Plan renewal", date: "2024-10-15" },
]

export function TransactionsPage() {
  const [search, setSearch] = useState("")
  const filtered = demo.filter((t) => search === "" || t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Transactions</h1><p className="text-muted-foreground">All financial transactions</p></div>
        <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
      </div>
      <Card>
        <CardHeader>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>User</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Description</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-sm">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.user}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === "Credit" ? "success" : "destructive"} className="gap-1">
                      {t.type === "Credit" ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`font-medium ${t.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                    {t.type === "Credit" ? "+" : "-"}&#8377;{t.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.desc}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
